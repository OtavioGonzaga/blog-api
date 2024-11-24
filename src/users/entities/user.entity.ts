import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from '../enums/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column('uuid', { name: 'keycloak_id' })
	keycloakId: string;

	@ApiProperty()
	@Column({ unique: true })
	username: string;

	@ApiProperty()
	@Column()
	name: string;

	@ApiProperty()
	@Column({ unique: true })
	email: string;

	@ApiProperty({ enum: UserRoles })
	@Column({ enum: UserRoles, default: 'standard' })
	role: string;

	@ApiProperty()
	@Column('timestamp with time zone', {
		default: () => 'CURRENT_TIMESTAMP',
		name: 'created_at',
	})
	createdAt: Date;

	@ApiProperty()
	@Column('timestamp with time zone', {
		default: () => 'CURRENT_TIMESTAMP',
		name: 'updated_at',
	})
	updatedAt: Date;
}
