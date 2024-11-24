import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	name: string;

	@IsBoolean()
	@IsOptional()
	enabled?: boolean;
}
