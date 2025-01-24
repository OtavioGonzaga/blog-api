import {
	Controller,
	FileTypeValidator,
	Get,
	HttpStatus,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';

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

	@Post('upload-picture')
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
	) {
		return this.profileService.uploadProfilePicture({
			keycloakId,
			picture,
		});
	}
}
