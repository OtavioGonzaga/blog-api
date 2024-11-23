import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsEmail,
	IsEnum,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { UserRoles } from '../enums/user-roles.enum';

export class CreateUserDto {
	@IsString({
		message: i18nValidationMessage<I18nTranslations>(
			'validation.IS_STRING',
		),
	})
	@MinLength(3, {
		message: i18nValidationMessage<I18nTranslations>(
			'validation.MIN_LENGTH',
		),
	})
	@MaxLength(63, {
		message: i18nValidationMessage<I18nTranslations>(
			'validation.MAX_LENGTH',
		),
	})
	@Matches(/^[a-zA-Z0-9._-]{3,63}$/, {
		message: i18nValidationMessage<I18nTranslations>('validation.MATCHES'),
	})
	@ApiProperty()
	username: string;

	@IsString({
		message: i18nValidationMessage<I18nTranslations>(
			'validation.IS_STRING',
		),
	})
	@MinLength(3, {
		message: i18nValidationMessage<I18nTranslations>(
			'validation.MIN_LENGTH',
		),
	})
	@MaxLength(255, {
		message: i18nValidationMessage<I18nTranslations>(
			'validation.MAX_LENGTH',
		),
	})
	@ApiProperty()
	name: string;

	@IsEmail(undefined, {
		message: i18nValidationMessage<I18nTranslations>('validation.IS_EMAIL'),
	})
	@ApiProperty({ example: 'email@exemple.com' })
	email: string;

	@IsEnum(UserRoles, {
		message: i18nValidationMessage<I18nTranslations>('validation.IS_ENUM', {
			enum: Object.values(UserRoles).join(', '),
		}),
	})
	// @IsOptional()
	@ApiPropertyOptional({ enum: UserRoles })
	role: UserRoles;
}
