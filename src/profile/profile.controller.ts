import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpStatus,
	MaxFileSizeValidator,
	ParseFilePipe,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Resource } from 'nest-keycloak-connect';
import { I18nContext } from 'nestjs-i18n';
import { KeycloakId } from 'src/decorators/user-id.decorator';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { User } from 'src/users/entities/user.entity';
import { ProfileService } from './profile.service';
import { UpdateResult } from 'typeorm';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@ApiTags('Profile')
@Controller('profile')
@Resource('users')
@ApiBearerAuth('access_token')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	@ApiOperation({ summary: 'Get user profile' })
	@ApiResponse({ status: HttpStatus.OK, type: User })
	getProfile(@KeycloakId() keycloakId: string): Promise<User> {
		return this.profileService.get(keycloakId);
	}

	@Post('picture')
	@ApiOperation({ summary: 'Get user profile' })
	@ApiResponse({ status: HttpStatus.OK, type: User })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Picture to upload',
		schema: {
			type: 'object',
			properties: {
				picture: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor('picture'))
	uploadProfilePicture(
		@KeycloakId() keycloakId: string,
		@UploadedFile(
			new ParseFilePipe({
				fileIsRequired: true,
				validators: [
					new MaxFileSizeValidator({
						maxSize: 500000,
						message: () =>
							I18nContext.current<I18nTranslations>().t(
								'validation.MAX_FILE_SIZE',
								{ args: { property: 'picture' } },
							),
					}),
					new FileTypeValidator({ fileType: 'image/*' }),
				],
			}),
		)
		picture: Express.Multer.File,
	): Promise<void> {
		return this.profileService.uploadProfilePicture({
			keycloakId,
			picture,
		});
	}

	@Delete('picture')
	@ApiOperation({ summary: 'Delete user profile picture' })
	@ApiResponse({ status: HttpStatus.OK, type: User })
	deleteProfilePicture(@KeycloakId() keycloakId: string): Promise<void> {
		return this.profileService.deleteProfilePicture(keycloakId);
	}

	@Patch()
	@ApiOperation({ summary: 'Update user profile' })
	@ApiResponse({ status: HttpStatus.OK, type: User })
	@ApiBody({ type: UpdateResult })
	updateProfile(
		@KeycloakId() keycloakId: string,
		@Body() user: UpdateProfileDto,
	): Promise<UpdateResult> {
		return this.profileService.update({ keycloakId, user });
	}
}
