<?php

if (!defined('BASEPATH')) exit('No direct script access allowed');

class LegalEntityUploader extends IntegrationDataUploader
{
    protected OrgStructureTreeBuilder $orgStructureBuilder;
    protected Structure_model $orgStructureStorage;
    protected OrgStructureLegalEntityStorage $orgStructureLegalEntityStorage;

    public function __construct()
    {
        parent::__construct();
        $this->orgStructureBuilder = new OrgStructureTreeBuilder();
        $this->orgStructureStorage = new Structure_model();
        $this->orgStructureLegalEntityStorage = new OrgStructureLegalEntityStorage();
    }

    /**
     * @param LegalEntity[] $legalEntities
     * @return void
     * @throws DatabaseException
     */
    protected function syncWithHSM(array $legalEntities): void
    {
        list($insert, $update, $delete) = $this->handle($legalEntities);
        $connectingTableData = $this->prepareDataForConnectingTable(array_merge($insert, $update));
        $orgStructureData = $this->prepareOrgStructureTreeData(array_merge($insert, $update));

        $this->orgStructureStorage->deleteStructures($delete);
        $this->orgStructureStorage->saveStructure($orgStructureData);
        $this->orgStructureLegalEntityStorage->save($connectingTableData);
    }

    protected static function prepareInput(array $data): array
    {
        $result = [];

        foreach ($data as $k => $v) {
            $result[$k] = array_merge($v, [
                'id' => (int) $v['id'],
            ]);
        }

        return $result;
    }

    /**
     * @param array<OrgStructureDto> $orgStructureTree
     * @return array<string, mixed>
     */
    private function prepareOrgStructureTreeData(array $orgStructureTree): array
    {
        return array_map(
            fn (OrgStructureDto $dto) => [
                'id' => $dto->id,
                'parent_id' => $dto->parentId,
                'name' => $dto->name,
                'level' => $dto->level,
                'path' => $dto->path,
            ],
            $orgStructureTree
        );
    }

    /**
     * @param array<OrgStructureDto> $orgStructureTree
     * @return array<string, mixed>
     */
    private function prepareDataForConnectingTable(array $orgStructureTree): array
    {
        return array_map(
            fn (OrgStructureDto $dto) => [
                'id' => $dto->id,
                'org_structure_level_id' => $dto->id,
                'division_id' => $dto->getDivisionId(),
                'legal_entity_id' => $dto->getLegalEntityId(),
            ],
            $orgStructureTree
        );
    }

    /**
     * @param LegalEntity[] $inputLegalEntities
     * @return array<int, array<string, mixed>>
     */
    private function handle(array $inputLegalEntities): array
    {
        if (!$inputLegalEntities) {
            return [];
        }

        $storedLegalEntities = $this->getStoredLegalEntities();
        $inputLegalEntities = $this->fixParentId($inputLegalEntities, $storedLegalEntities);
        $storedStructures = Arr::indexBy($this->getStoredStructures(), 'legal_entity_id');

        $needInsert = array_filter($inputLegalEntities, fn (LegalEntity $le) => !$le->deleted() && !isset($storedStructures[$le->getId()]));
        $needUpdate = array_filter($inputLegalEntities, fn (LegalEntity $le) => !$le->deleted() && isset($storedStructures[$le->getId()]));
        $needDelete = array_filter($inputLegalEntities, fn (LegalEntity $le) => $le->deleted());

        /** @var array<int, LegalEntity[]> $inputChildren */
        $inputChildren = $this->indexByParentId($needInsert); // todo:: name

        $insert = $update = $delete = [];
        foreach ($storedStructures as $parent) {
            $childrenNodes = $inputChildren[$parent['legal_entity_id']] ?? [];
            foreach ($childrenNodes as $child) {
                $this->orgStructureBuilder->buildTree($child, $inputChildren, $parent['id'], $parent['path'], $insert);
            }
        }

        foreach ($needUpdate as $le) {
            $currNode = $storedStructures[$le->getId()];
            $parentNode = $storedStructures[$le->getParentId()];
            $newPath = Structure_model::buildPath($currNode['id'], $parentNode['path']);

            $dto = new OrgStructureDto();
            $dto->id = $currNode['id'];
            $dto->parentId = $parentNode['id'];
            $dto->name = $le->getName();
            $dto->level = Structure_model::calculateLevel($newPath);
            $dto->path = $newPath;
            $dto->isDivision = false;
            $dto->originalId = $le->getId();

            $update[] = $dto;
        }

        $structuresParents = $this->todoRenameMe($storedStructures);
        foreach ($needDelete as $le) {
            $structure = $storedStructures[$le->getId()];
            $this->collectSubtreeIds($structure['id'], $structuresParents, $delete);
        }

        return [$insert, $update, $delete];
    }

    private function todoRenameMe(array $storedStructures): array // todo::
    {
        $map = array_combine(
            array_column($storedStructures, 'id'),
            array_column($storedStructures, 'legal_entity_id')
        );

        $result = [];

        foreach ($storedStructures as $structure) {
            $legalEntityId = $map[$structure['parent_id']];
            $result[$legalEntityId][] = $structure;
        }

        return $result;
    }

    /**
     * @param int $nodeId
     * @param array<int, array> $children
     * @param array<int> $result
     * @return void
     */
    private function collectSubtreeIds(int $nodeId, array $children, array &$result) {
        $result[] = $nodeId;
        foreach ($children[$nodeId] ?? [] as $child) {
            $this->collectSubtreeIds($child['id'], $children, $result);
        }
    }

    /**
     * @param LegalEntity[] $legalEntities
     * @return array
     */
    private function indexByParentId(array $legalEntities): array
    {
        $result = [];
        foreach ($legalEntities as $le) {
            $result[$le->getParentId()][] = $le;
        }
        return $result;
    }

    private function getStoredStructures(): array
    {
        $storedStructures = array_filter(
            $this->oslStorage->fetchAll(),
            fn (array $v) => !!$v['legal_entity_id']
        );
        $rootStructure = ['id' => 0, 'parent_id' => 0, 'path' => '', 'legal_entity_id' => 0];
        return array_merge($storedStructures, [$rootStructure]);
    }

    private function getStoredLegalEntities(): array
    {
        return Arr::indexById($this->storage->fetchAllLegalEntities());
    }

    /**
     * legalEntities with not-existing parent_id make the root
     *
     * @param LegalEntity[] $inputLegalEntities
     * @param LegalEntity[] $storedLegalEntities
     * @return array
     */
    private function fixParentId(array $inputLegalEntities, array $storedLegalEntities): array
    {
        $inputLegalEntities = Arr::indexById($inputLegalEntities);

        array_walk($inputLegalEntities, function (LegalEntity $le) use ($inputLegalEntities, $storedLegalEntities) {
            $parentId = $le->getParentId();
            if (!isset($storedLegalEntities[$parentId]) && !isset($inputLegalEntities[$parentId])) {
                $le->makeRoot();
            }
        });

        return $inputLegalEntities;
    }
}
