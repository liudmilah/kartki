<?php

class IntegrationDataUploaderTest extends CodeigniterTest
{
    protected User_model $users;
    protected IntegrationDataStorage $storage;
    protected OrgStructureLegalEntityStorage $oslStorage;

    public function testInvalidTableName()
    {
        $this->expectException(EmptyDataException::class);
        $this->upload('invalid', [$this->getPerson(2000)]);
    }

    public function testEmptyData()
    {
        $this->expectException(EmptyDataException::class);
        $this->upload(IntegrationDataStorage::TABLE_PERSONNEL, []);
    }

    /**
     * @dataProvider personnelDataProvider
     */
    public function testPersonnelValidation(string $message, array $data)
    {
        $this->expectExceptionMessage($message);
        $this->upload(IntegrationDataStorage::TABLE_PERSONNEL, $data);
    }

    /**
     * @dataProvider employeeDataProvider
     */
    public function testEmployeeValidation(string $message, array $data)
    {
        $this->expectExceptionMessage($message);
        $this->upload(IntegrationDataStorage::TABLE_EMPLOYEE, $data);
    }

    /**
     * @dataProvider legalEntityDataProvider
     */
    public function testLegalEntityValidation(string $message, array $data)
    {
        $this->expectExceptionMessage($message);
        $this->upload(IntegrationDataStorage::TABLE_LEGAL_ENTITY, $data);
    }

    /**
     * @dataProvider divisionDataProvider
     */
    public function testDivisionValidation(string $message, array $data)
    {
        $this->expectExceptionMessage($message);
        $this->upload(IntegrationDataStorage::TABLE_DIVISION, $data);
    }

    /**
     * @dataProvider positionDataProvider
     */
    public function testPositionValidation(string $message, array $data)
    {
        $this->expectExceptionMessage($message);
        $this->upload(IntegrationDataStorage::TABLE_POSITION, $data);
    }

    /**
     * @dataProvider positionAssignmentDataProvider
     */
    public function testPositionAssignmentValidation(string $message, array $data)
    {
        $this->expectExceptionMessage($message);
        $this->upload(IntegrationDataStorage::TABLE_POSITION_ASSIGNMENT, $data);
    }

    public function testEmployee()
    {
        list($empl, $pers) = [1000, 2000];
        $getEmployees = fn (int $id) => $this->storage->fetchAllById(IntegrationDataStorage::TABLE_EMPLOYEE, [$id]);

        // INSERT without person
        $this->uploadEmployee($empl, $pers);
        $this->assertUserDoesNotExist($empl);
        $this->assertCount(1, $getEmployees($empl));

        // INSERT the same data once again
        $this->assertCount(1, $getEmployees($empl));
        $this->uploadEmployee($empl, $pers);
        $this->assertCount(1, $getEmployees($empl));

        // INSERT with person
        $this->uploadPersonnel($pers);
        $this->uploadEmployee($empl, $pers);
        $user = $this->users->getUserById($empl);
        $this->assertUserDoesNotHaveOrgStructureData($user);
        $this->assertUserIsStudent($user);
        $this->assertUserIsActive($user);
        $this->assertUserPresentsInEmployeesTable($user);

        // INSERT expired
        $this->uploadEmployee($empl, $pers, ['state' => 'ins', 'date_to' => date('Y-m-d', strtotime('-1 hour'))]);
        $user = $this->users->getUserById($empl);
        $this->assertUserIsNotActive($user);

        // UPDATE - make active
        $this->uploadEmployee($empl, $pers, ['state' => 'upd']);
        $user = $this->users->getUserById($empl);
        $this->assertUserIsActive($user);

        // DELETE
        $this->uploadEmployee($empl, $pers, ['state' => 'del']);
        $user = $this->users->getUserById($empl);
        $this->assertUserIsNotActive($user);
    }

    public function testPersonnel()
    {
        list($empl, $pers) = [1000, 2000];
        $getPersonnel = fn (int $id) => $this->storage->fetchAllById(IntegrationDataStorage::TABLE_PERSONNEL, [$id]);

        // INSERT without employee
        $this->uploadPersonnel($pers);
        $this->assertUserDoesNotExist($empl);
        $this->assertCount(1, $getPersonnel($pers));

        // INSERT the same data once again
        $this->assertCount(1, $getPersonnel($pers));
        $this->uploadPersonnel($pers);
        $this->assertCount(1, $getPersonnel($pers));

        // INSERT with employee
        $this->uploadEmployee($empl, $pers);
        $this->uploadPersonnel($pers);
        $user = $this->users->getUserById($empl);
        $this->assertUserDoesNotHaveOrgStructureData($user);
        $this->assertUserIsStudent($user);
        $this->assertUserIsActive($user);
        $this->assertUserPresentsInEmployeesTable($user);

        // UPDATE
        $this->uploadPersonnel(
            $pers,
            $data = [
                'state' => 'upd',
                'name' => 'Antonio',
                'patronymic' => 'Napolitano',
                'email' => 'new@example.com',
            ]
        );
        $user = $this->users->getUserById($empl);
        $this->assertEquals($user['first_name'], $data['name']);
        $this->assertEquals($user['midle_name'], $data['patronymic']);
        $this->assertEquals($user['email'], $data['email']);

        // DELETE
        $this->uploadPersonnel($pers, ['state' => 'del']);
        $user = $this->users->getUserById($empl);
        $this->assertUserIsNotActive($user);
    }

    public function testLegalEntity()
    {
        list($empl, $pers, $le, $div, $pos, $pa) = [1000, 2000, 3000, 4000, 5000, 6000];
        $getLE = fn (int $id) => $this->storage->fetchAllById(IntegrationDataStorage::TABLE_LEGAL_ENTITY, [$id]);
        $getOrgStructure = fn (int $id) => $this->storage->fetchAllById(IntegrationDataStorage::TABLE_LEGAL_ENTITY, [$id]);

         // INSERT root l.e. without division
        $leData = array_merge($this->getLegalEntity($le), ['parent_id' => 0]);
        $this->uploadLegalEntity($le, $leData);
        $this->assertCount(1, $getLE($le));
        $this->assertCount(1, $this->oslStorage->fetchAllByLegalEntity($le));
        $this->assertOrgStructureForLegalEntityExists($leData, true);

         // INSERT root l.e. (with non-existent parent)
        $le2 = 7000;
        $leData2 = array_merge($this->getLegalEntity($le2), ['parent_id' => 5]);
        $this->uploadLegalEntity($le2, $leData2);
        $this->assertOrgStructureForLegalEntityExists($leData2, true);

         // INSERT - add node to existing parent
        $le3 = 8000;
        $leData3 = array_merge($this->getLegalEntity($le3), ['parent_id' => $le]);
        $this->uploadLegalEntity($le3, $leData3);
        $this->assertOrgStructureForLegalEntityExists($leData, true);
        $this->assertOrgStructureForLegalEntityExists($leData3, false);

        // UPDATE name and parent node
        $leData3 = array_merge($this->getLegalEntity($le3), ['parent_id' => $le2, 'full_name' => 'Google']);
        $this->uploadLegalEntity($le3, $leData3);
        $this->assertOrgStructureForLegalEntityExists($leData3, false);

        // INSERT the same node
        $this->assertCount(1, $getLE($le));
        $this->assertCount(1, $this->oslStorage->fetchAllByLegalEntity($le));
        $this->uploadLegalEntity($le);
        $this->assertCount(1, $getLE($le));
        $this->assertCount(1, $this->oslStorage->fetchAllByLegalEntity($le));

        // DELETE node
        $this->assertCount(1, $getLE($le));
        $this->assertCount(1, $this->oslStorage->fetchAllByLegalEntity($le));
        $this->assertCount(1, $this->oslStorage->fetchAllByLegalEntity($le3));
        $this->uploadLegalEntity($le, ['state' => 'del']);
        $this->assertCount(1, $getLE($le));
        $this->assertCount(0, $this->oslStorage->fetchAllByLegalEntity($le));
        $this->assertCount(0, $this->oslStorage->fetchAllByLegalEntity($le3));
    }

    public function testPosition()
    {
        list($empl, $pers, $le, $div, $pos, $pa) = [1000, 2000, 3000, 4000, 5000, 6000];
        $getPositions = fn (int $id) => $this->storage->fetchAllById(IntegrationDataStorage::TABLE_POSITION, [$id]);

        // load needed models
        $this->uploadEmployee($empl, $pers);
        $this->uploadPersonnel($pers);
        $this->uploadLegalEntity($le);
        $this->uploadDivision($div, $le);

        $orgStructureId = $this->oslStorage->getOrgStructureIdByDivision($div);
        $this->assertNotEmpty($orgStructureId);

        // INSERT without position assignment
        $this->uploadPosition($pos);
        $user = $this->users->getUserById($empl);
        $this->assertUserDoesNotHaveOrgStructureData($user);
        $this->assertCount(1, $getPositions($pos));

        // INSERT with position assignment
        $this->uploadPositionAssignment($pa, $empl, $pos, $le, $div);
        $this->uploadPosition($pos);
        $user = $this->users->getUserById($empl);
        $this->assertUserHasOrgStructureData($user, $orgStructureId);
        $this->assertUserIsStudent($user);

        // INSERT the same data once again
        $this->assertCount(1, $getPositions($pos));
        $this->uploadPosition($pos);
        $this->assertCount(1, $getPositions($pos));

        // UPDATE
        $this->uploadPosition($pos, ['state' => 'upd', 'isHead' => true]);
        $user = $this->users->getUserById($empl);
        $this->assertUserHasOrgStructureData($user, $orgStructureId);
        $this->assertUserIsManager($user);

        // DELETE
        $this->uploadPosition($pos, ['state' => 'del', 'isHead' => true]);
        $user = $this->users->getUserById($empl);
        $this->assertUserDoesNotHaveOrgStructureData($user);

        // INSERT without employee data
        $this->uploadPosition($empl2 = 10000);
        $this->assertUserDoesNotExist($empl2);
    }

    public function testPositionAssignment()
    {
        list($empl, $pers, $le, $div, $pos, $pa) = [1000, 2000, 3000, 4000, 5000, 6000];
        $getPA = fn (int $id) => $this->storage->fetchAllById(IntegrationDataStorage::TABLE_POSITION_ASSIGNMENT, [$id]);

        // load needed models
        $this->uploadEmployee($empl, $pers);
        $this->uploadPersonnel($pers);
        $this->uploadLegalEntity($le);
        $this->uploadDivision($div, $le);
        $this->uploadPosition($pos, ['isHead' => true]);

        $orgStructureId = $this->oslStorage->getOrgStructureIdByDivision($div);
        $this->assertNotEmpty($orgStructureId);

        // INSERT
        $user = $this->users->getUserById($empl);
        $this->assertUserDoesNotHaveOrgStructureData($user);
        $this->uploadPositionAssignment($pa, $empl, $pos, $le, $div);
        $user = $this->users->getUserById($empl);
        $this->assertUserHasOrgStructureData($user, $orgStructureId);
        $this->assertUserIsManager($user);

        // INSERT the same data once again
        $this->assertCount(1, $getPA($pa));
        $this->uploadPositionAssignment($pa, $empl, $pos, $le, $div);
        $this->assertCount(1, $getPA($pa));

        // UPDATE
        $this->uploadPosition($pos, ['state' => 'upd', 'isHead' => false]);
        $this->uploadPositionAssignment($pa, $empl, $pos, $le, $div, ['state' => 'upd']);
        $user = $this->users->getUserById($empl);
        $this->assertUserHasOrgStructureData($user, $orgStructureId);
        $this->assertUserIsStudent($user);

        // DELETE and check that user's data remain the same
        $this->uploadPositionAssignment($pa, $empl, $pos, $le, $div, ['state' => 'del']);
        $user = $this->users->getUserById($empl);
        $this->assertUserHasOrgStructureData($user, $orgStructureId);
        $this->assertUserIsStudent($user);

        // INSERT without employee data
        $this->uploadPositionAssignment(10000, $empl2 = 10001, 10002, 10000, 10000);
        $this->assertUserDoesNotExist($empl2);
    }

    public function personnelDataProvider(): array
    {
        $data = $this->getPerson(1000);

        return [
            'empty id' => [
                json_encode(['id' => 'This value should be positive.']),
                [ self::replace($data, 'id', null) ],
            ],
            'id string' => [
                json_encode(['id' => 'This value should be positive.']),
                [ self::replace($data, 'id', 'my id') ],
            ],
            'long address' => [
                json_encode(['address' => 'This value is too long. It should have 32 characters or less.']),
                [ self::replace($data, 'address', str_repeat('*', 33)) ],
            ],
            'date_birth not date' => [
                json_encode(['date_birth' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_birth', 'invalid') ],
            ],
            'invalid email format' => [
                json_encode(['email' => 'This value is not a valid email address.']),
                [ self::replace($data, 'email', 'invalid') ],
            ],
            'long first name' => [
                json_encode(['name' => 'This value is too long. It should have 40 characters or less.']),
                [ self::replace($data, 'name', str_repeat('*', 41)) ],
            ],
            'long patronymic name' => [
                json_encode(['patronymic' => 'This value is too long. It should have 40 characters or less.']),
                [ self::replace($data, 'patronymic', str_repeat('*', 41)) ],
            ],
            'long surname name' => [
                json_encode(['surname' => 'This value is too long. It should have 40 characters or less.']),
                [ self::replace($data, 'surname', str_repeat('*', 41)) ],
            ],
            'invalid state' => [
                json_encode(['state' => 'The value you selected is not a valid choice.']),
                [ self::replace($data, 'state', 'invalid') ],
            ],
        ];
    }

    public function employeeDataProvider(): array
    {
        $data = $this->getEmployee(1000);

        return [
            'empty id' => [
                json_encode(['id' => 'This value should be positive.']),
                [ self::replace($data, 'id', null) ],
            ],
            'date_from not date' => [
                json_encode(['date_from' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_from', 'invalid') ],
            ],
            'date_to not date' => [
                json_encode(['date_to' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_to', 'invalid') ],
            ],
            'invalid state' => [
                json_encode(['state' => 'The value you selected is not a valid choice.']),
                [ self::replace($data, 'state', 'invalid') ],
            ],
        ];
    }

    public function legalEntityDataProvider(): array
    {
        $data = $this->getLegalEntity(1000);

        return [
            'empty id' => [
                json_encode(['id' => 'This value should be positive.']),
                [ self::replace($data, 'id', null) ],
            ],
            'long short_name' => [
                json_encode(['short_name' => 'This value is too long. It should have 100 characters or less.']),
                [ self::replace($data, 'short_name', str_repeat('*', 101)) ],
            ],
            'long full_name' => [
                json_encode(['full_name' => 'This value is too long. It should have 255 characters or less.']),
                [ self::replace($data, 'full_name', str_repeat('*', 256)) ],
            ],
            'date_from not date' => [
                json_encode(['date_from' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_from', 'invalid') ],
            ],
            'date_to not date' => [
                json_encode(['date_to' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_to', 'invalid') ],
            ],
            'invalid state' => [
                json_encode(['state' => 'The value you selected is not a valid choice.']),
                [ self::replace($data, 'state', 'invalid') ],
            ],
        ];
    }

    public function divisionDataProvider(): array
    {
        $data = $this->getDivision(1000);

        return [
            'empty id' => [
                json_encode(['id' => 'This value should be positive.']),
                [ self::replace($data, 'id', null) ],
            ],
            'long short_name' => [
                json_encode(['short_name' => 'This value is too long. It should have 255 characters or less.']),
                [ self::replace($data, 'short_name', str_repeat('*', 256)) ],
            ],
            'long full_name' => [
                json_encode(['full_name' => 'This value is too long. It should have 255 characters or less.']),
                [ self::replace($data, 'full_name', str_repeat('*', 256)) ],
            ],
            'date_from not date' => [
                json_encode(['date_from' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_from', 'invalid') ],
            ],
            'date_to not date' => [
                json_encode(['date_to' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_to', 'invalid') ],
            ],
            'invalid state' => [
                json_encode(['state' => 'The value you selected is not a valid choice.']),
                [ self::replace($data, 'state', 'invalid') ],
            ],
        ];
    }

    public function positionDataProvider(): array
    {
        $data = $this->getPosition(1000);

        return [
            'empty id' => [
                json_encode(['id' => 'This value should be positive.']),
                [ self::replace($data, 'id', null) ],
            ],
            'long short_name' => [
                json_encode(['short_name' => 'This value is too long. It should have 100 characters or less.']),
                [ self::replace($data, 'short_name', str_repeat('*', 101)) ],
            ],
            'long full_name' => [
                json_encode(['full_name' => 'This value is too long. It should have 100 characters or less.']),
                [ self::replace($data, 'full_name', str_repeat('*', 101)) ],
            ],
            'date_from not date' => [
                json_encode(['date_from' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_from', 'invalid') ],
            ],
            'date_to not date' => [
                json_encode(['date_to' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_to', 'invalid') ],
            ],
            'invalid state' => [
                json_encode(['state' => 'The value you selected is not a valid choice.']),
                [ self::replace($data, 'state', 'invalid') ],
            ],
        ];
    }

    public function positionAssignmentDataProvider(): array
    {
        $data = $this->getPositionAssignment(1000);

        return [
            'empty id' => [
                json_encode(['id' => 'This value should be positive.']),
                [ self::replace($data, 'id', null) ],
            ],
            'date_from not date' => [
                json_encode(['date_from' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_from', 'invalid') ],
            ],
            'date_to not date' => [
                json_encode(['date_to' => 'This value is not a valid date.']),
                [ self::replace($data, 'date_to', 'invalid') ],
            ],
            'invalid state' => [
                json_encode(['state' => 'The value you selected is not a valid choice.']),
                [ self::replace($data, 'state', 'invalid') ],
            ],
        ];
    }

    protected function getEmployee(int $id, int $personId = null): array
    {
        return [
            'id' => $id,
            'date_from' => date('Y-m-d', strtotime('-1 day')),
            'date_to' => date('Y-m-d', strtotime('+1 day')),
            'number' => 0,
            'person_id' => $personId ?: $id,
            'external_id' => 0,
            'state' => 'ins',
        ];
    }

    protected function getPerson(int $id): array
    {
        return [
            'id' => $id,
            'address' => '100 East 34th Street, New York',
            'date_birth' => '1990-08-19',
            'email' => rand().'@example.com',
            'name' => 'John',
            'patronymic' => 'Justin',
            'surname' => 'Smith',
            'external_id' => 0,
            'state' => 'ins',
        ];
    }

    protected function getPosition(int $id): array
    {
        return [
            'id' => $id,
            'division_id' => $id,
            'abbreviation' => 'PM',
            'short_name' => 'Product manager',
            'full_name' => 'Product manager',
            'date_from' => date('Y-m-d', strtotime('-1 day')),
            'date_to' => date('Y-m-d', strtotime('+1 day')),
            'grade_id' => 0,
            'rank_id' => 0,
            'stake' => 50.00,
            'category_id' => 0,
            'external_id' => 0,
            'job_title_id' => 0,
            'division_head_id' => 0,
            'isHead' => false,
            'state' => 'ins',
        ];
    }

    protected function getPositionAssignment(int $id, int $emplId = null, int $posId = null, int $leId = null, int $divId = null): array
    {
        return [
            'id' => $id,
            'date_from' => date('Y-m-d', strtotime('-1 day')),
            'date_to' => date('Y-m-d', strtotime('+1 day')),
            'stake' => 50.00,
            'category_id' => 0,
            'employee_id' => $emplId ?: $id,
            'placement_id' => 0,
            'position_id' => $posId ?: $id,
            'status_id' => 0,
            'substitution_type_id' => 0,
            'external_id' => 0,
            'person_id' => 0,
            'legal_entity_id' => $leId ?: $id,
            'supstituted_employee_id' => 0,
            'grade_id' => 0,
            'rank_id' => 0,
            'division_id' => $divId ?: $id,
            'hazordous_conditions' => 0,
            'state' => 'ins',
        ];
    }

    protected function getDivision(int $id, int $legalEntityId = null): array
    {
        return [
            'id' => $id,
            'parent_id' => 0,
            'legal_entity_id' => $legalEntityId ?: $id,
            'short_name' => 'Client Engineering',
            'full_name' => 'Client and UI Engineering',
            'division_head_id' => 0,
            'external_id' => 0,
            'date_from' => date('Y-m-d', strtotime('-1 day')),
            'date_to' => date('Y-m-d', strtotime('+1 day')),
            'state' => 'ins',
        ];
    }

    protected function getLegalEntity(int $id): array
    {
        return [
            'id' => $id,
            'short_name' => 'Netflix',
            'full_name' => 'Netflix',
            'date_from' => date('Y-m-d', strtotime('-1 day')),
            'date_to' => date('Y-m-d', strtotime('+1 day')),
            'parent_id' => 0,
            'external_id' => 0,
            'state' => 'ins',
        ];
    }

    protected function upload(string $table, array $data): void
    {
        IntegrationDataUploader::uploader($table)->upload($data);
    }

    protected function uploadEmployee(int $employeeId, int $personId, array $extra = [])
    {
        self::upload(
            IntegrationDataStorage::TABLE_EMPLOYEE,
            [array_merge($this->getEmployee($employeeId, $personId), $extra)]
        );
    }

    protected function uploadPersonnel(int $personId, array $extra = [])
    {
        self::upload(
            IntegrationDataStorage::TABLE_PERSONNEL,
            [array_merge($this->getPerson($personId), $extra)]
        );
    }

    protected function uploadDivision(int $divisionId, int $legalEntityId, array $extra = [])
    {
        self::upload(
            IntegrationDataStorage::TABLE_DIVISION,
            [array_merge($this->getDivision($divisionId, $legalEntityId), $extra)]
        );
    }

    protected function uploadLegalEntity(int $legalEntityId, array $extra = [])
    {
        self::upload(
            IntegrationDataStorage::TABLE_LEGAL_ENTITY,
            [array_merge($this->getLegalEntity($legalEntityId), $extra)]
        );
    }

    protected function uploadPosition(int $positionId, array $extra = [])
    {
        self::upload(
            IntegrationDataStorage::TABLE_POSITION,
            [array_merge($this->getPosition($positionId), $extra)]
        );
    }

    protected function uploadPositionAssignment(int $pa, int $empl, int $pos, int $le, int $div, array $extra = [])
    {
        self::upload(
            IntegrationDataStorage::TABLE_POSITION_ASSIGNMENT,
            [array_merge($this->getPositionAssignment($pa, $empl, $pos, $le, $div), $extra)]
        );
    }

    protected function assertUserDoesNotExist(int $userId)
    {
        $this->assertEmpty($this->users->getUserById($userId));
    }

    protected function assertUserDoesNotHaveOrgStructureData(array $user)
    {
        $this->assertEmpty($user['org_structure_level_id']);
        $this->assertEmpty($user['position']);
    }

    protected function assertUserHasOrgStructureData(array $user, int $orgStructureId)
    {
        $this->assertEquals($orgStructureId, $user['org_structure_level_id']);
        $this->assertNotEmpty($user['position']);
    }

    protected function assertUserIsManager(array $user)
    {
        $this->assertEquals(1, $user['is_chief']);
        $this->assertTrue($this->users->hasRoleStudent($user['id']));
        $this->assertTrue($this->users->hasRoleManager($user['id']));
    }

    protected function assertUserIsStudent(array $user)
    {
        $this->assertEquals(0, $user['is_chief']);
        $this->assertTrue($this->users->hasRoleStudent($user['id']));
        $this->assertFalse($this->users->hasRoleManager($user['id']));
    }

    protected function assertUserIsActive(array $user)
    {
        $this->assertEquals(0, $user['hidden']);
        $this->assertEquals(1, $user['active']);
    }

    protected function assertUserIsNotActive(array $user)
    {
        $this->assertEquals(1, $user['hidden']);
        $this->assertEquals(0, $user['active']);
    }

    protected function assertOrgStructureForLegalEntityDoesNotExist(int $le)
    {
        $this->assertEmpty($this->getOrgStrIdByLegalEntity($le));
    }

    protected function assertOrgStructureForLegalEntityExists(array $le, bool $isRoot) // todo:: about isRoot
    {
        $oslId = $this->getOrgStrIdByLegalEntity($le['id']);
        $this->assertNotEmpty($oslId);

        $osl = $this->CI->structure->getById($oslId);
        $this->assertNotEmpty($osl);

        $oslParentId = $isRoot ? 0 : $this->getOrgStrIdByLegalEntity($le['parent_id']);
        $this->assertEquals($osl['parent_id'], $oslParentId);
        $this->assertEquals($osl['name'], $le['full_name']);
        $this->assertEquals($osl['path'], $isRoot ? $osl['id'] : $oslParentId.'.'.$osl['id']);
        $this->assertEquals($osl['level'], $isRoot ? 0 : 1);
    }

    private function getOrgStrIdByLegalEntity(int $leId)
    {
        return $this->oslStorage->getStructureIdByLegalEntity($leId);
    }

    protected function assertOrgStructureForDivisionDoesNotExist(int $div)
    {
        $this->assertEmpty($this->oslStorage->getOrgStructureIdByDivision($div));
    }

    protected function assertOrgStructureForDivisionExists(int $div)
    {
        $this->assertNotEmpty($this->oslStorage->getOrgStructureIdByDivision($div));
    }

    protected function assertUserPresentsInEmployeesTable(array $user)
    {
        $data = $this->CI->employeeModel->getEmployeeById($user['id']);
        $this->assertNotEmpty($data);
        $this->assertEquals($user['person_id'], $data['person_id']);
        $this->assertEquals(strtotime($user['employment_date']), strtotime($data['entry_at']));
        $this->assertEquals($user['external_idx'], $data['extId']);
    }

    protected function assertUserDataWasUpdated(Employee $employee, Personnel $personnel): void
    {
        $dto = new IntegrationUserDto($employee, $personnel);
        $user = $this->users->getUserById($employee->getId());

        $this->assertEquals($user['id'], $dto->id);
        $this->assertEquals($user['first_name'], $dto->firstName);
        $this->assertEquals($user['last_name'], $dto->lastName);
        $this->assertEquals($user['midle_name'], $dto->middleName);
        $this->assertEquals($user['email'], $dto->email);
        $this->assertEquals($user['active'], $dto->active);
        $this->assertEquals($user['hidden'], !$dto->active);
        $this->assertEquals($user['external_idx'], $dto->externalId);
        $this->assertEquals($user['person_id'], $dto->personId);
        $this->assertEquals($user['org_structure_level_id'], $dto->legalEntityId);
        $this->assertEquals($user['employment_date'], $dto->dateFrom);
        $this->assertEquals($user['dismissal_date'], $dto->dateTo);
        $this->assertEquals($user['personnel_number'], $dto->number);
    }

    protected function loadClasses(): void
    {
        $this->CI->load->model('Structure_model');
        $this->CI->load->model('Employee_model', 'employeeModel');
        $this->CI->load->library('integration/entities/baseIntegrationEntity');
        $this->CI->load->library('integration/entities/employee');
        $this->CI->load->library('integration/entities/personnel');
        $this->CI->load->library('integration/entities/legalEntity');
        $this->CI->load->library('integration/entities/division');
        $this->CI->load->library('integration/entities/positionAssignment');
        $this->CI->load->library('integration/entities/employeePosition');
        $this->CI->load->library('integration/integrationUserDto');
        $this->CI->load->library('integration/storages/OrgStructureLegalEntityStorage', null, 'oslStorage');
        $this->CI->load->library('integration/orgStructureTreeBuilder');
        $this->CI->load->library('integration/storages/integrationDataStorage', null, 'storage');
        $this->CI->load->library('integration/usersUpdater', null, 'usersUpdater');
        $this->CI->load->library('validator');
        $this->CI->load->library('arr');
        $this->CI->load->library('integration/uploaders/integrationDataUploader', null, 'uploader');
        $this->CI->load->library('integration/uploaders/orgStructureDto');
        $this->CI->load->library('integration/uploaders/personnelUploader');
        $this->CI->load->library('integration/uploaders/employeeUploader');
        $this->CI->load->library('integration/uploaders/divisionUploader');
        $this->CI->load->library('integration/uploaders/legalEntityUploader');
        $this->CI->load->library('integration/uploaders/positionUploader');
        $this->CI->load->library('integration/uploaders/positionAssignmentUploader');

        $this->users = $this->CI->user;
        $this->storage = $this->CI->storage;
        $this->oslStorage = $this->CI->oslStorage;
    }
}
