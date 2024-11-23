import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRoles } from '../enums/user-roles.enum';

export class CreateUserDto {
	@IsString()
	username: string;

	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsEnum(UserRoles)
	role: UserRoles;
}
