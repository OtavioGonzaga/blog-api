import { RequiredActions } from '../enums/required-actions.enum';

export class CreateUserDto {
	username: string;

	email: string;

	name: string;

	enabled?: boolean;

	requiredActions?: RequiredActions[];

	emailVerified?: boolean;
}
