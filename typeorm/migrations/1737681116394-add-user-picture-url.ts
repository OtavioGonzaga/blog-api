import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserPictureUrl1737681116394 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'users',
			new TableColumn({
				name: 'picture_url',
				type: 'varchar',
				length: '255',
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('users', 'picture_url');
	}
}
