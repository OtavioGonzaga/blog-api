import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUsers1732142326512 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						default: 'uuid_generate_v4()',
					},
					{
						name: 'keycloak_id',
						type: 'uuid',
						isUnique: true,
					},
					{
						name: 'username',
						type: 'varchar',
						length: '63',
						isUnique: true,
					},
					{
						name: 'name',
						type: 'varchar',
						length: '255',
					},
					{
						name: 'email',
						type: 'varchar',
						isUnique: true,
						length: '255',
					},
					{
						name: 'role',
						type: 'enum',
						enum: ['admin', 'standard'],
						default: `'standard'`,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
						onUpdate: 'CURRENT_TIMESTAMP',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users');
	}
}
