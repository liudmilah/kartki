<?php

if (!defined('BASEPATH')) exit('No direct script access allowed');

class DivisionUploader extends IntegrationDataUploader
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
     * @param Division[] $divisions
     * @return void
     * @throws DatabaseException
     */
    protected function syncWithHSM(array $divisions): void
    {
        $orgStructureTree = $this->buildTree($divisions);
        $connectingTableData = $this->prepareDataForConnectingTable($orgStructureTree);
        $orgStructureData = $this->prepareOrgStructureTreeData($orgStructureTree);
        $this->orgStructureStorage->saveStructure($orgStructureData);
        $this->orgStructureLegalEntityStorage->save($connectingTableData);
    }

    private function prepareOrgStructureTreeData(array $orgStructureTree)
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
     * @param Division[] $divisions
     * @return array<OrgStructureDto>
     */
    private function buildTree(array $divisions): array
    {
        $legalEntities = $this->storage->fetchLegalEntitiesByDivisions($divisions);
        if (!$legalEntities) {
            return [];
        }

        $storedStructures = $this->getStoredStructures();

        /** @var array<int, Division[]> $inputChildren */
        $inputChildren = $this->indexByParentId($divisions); // todo:: name

        $tree = [];
        foreach ($storedStructures as $structure) {
            $isDivision = !!$structure['division_id'];
            if ($isDivision) {
                $originalId = $structure['division_id'];
                $children =  $inputChildren['div'][$originalId] ?? [];
            } else {
                $originalId = $structure['legal_entity_id'];
                $children = $inputChildren['le'][$originalId] ?? [];
            }
            foreach ($children as $child) {
                $this->orgStructureBuilder->buildTree($child, $inputChildren, $structure['id'], $structure['path'], $tree);
            }
        }

        return $tree;
    }

    /**
     * @param Division[] $divisions
     * @return array
     */
    private function indexByParentId(array $divisions): array
    {
        $result = [
            'div' => [],
            'le' => [],
        ];

        foreach ($divisions as $div) {
            // divId and leId can coincide
            if ($div->getParentId() === 0) {
                $result['le'][$div->getLegalEntityId()][] = $div;
            } else {
                $result['div'][$div->getParentId()][] = $div;
            }
        }
        return $result;
    }

    private function getStoredStructures(): array
    {
        $storedStructures = $this->oslStorage->fetchAll();
        $rootStructure = ['id' => 0, 'path' => '', 'division_id' => 0];
        return array_merge($storedStructures, [$rootStructure]);
    }

    protected static function prepareInput(array $data): array
    {
        $result = [];

        foreach ($data as $k => $v) {
            $result[$k] = array_merge($v, [
                'id' => (int) $v['id'],
                'division_head_id' => (int) $v['division_head_id'],
                'legal_entity_id' => (int) $v['legal_entity_id'],
            ]);
        }

        return $result;
    }
}
