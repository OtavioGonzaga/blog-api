import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsBoolean()
	@IsOptional()
	enabled?: boolean;
}
