import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Resource, Roles } from 'nest-keycloak-connect';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { KeycloakUserRoles } from 'src/keycloak/enums/keycloak-user-roles.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('/users')
@Resource('users')
@ApiBearerAuth('access_token')
@Roles({ roles: [KeycloakUserRoles.ADMIN] })
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: HttpStatus.OK, type: Array<User> })
	async getUsers(): Promise<User[]> {
		return this.usersService.getUsers();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get an user' })
	@ApiResponse({ status: HttpStatus.OK, type: User })
	@ApiResponse({ status: HttpStatus.NOT_FOUND })
	async getUser(
		@Param(
			'id',
			new ParseUUIDPipe({
				exceptionFactory: () => {
					const i18n = I18nContext.current<I18nTranslations>();
					return new BadRequestException(
						i18n.t('validation.IS_UUID', {
							lang: I18nContext.current().lang,
							args: {
								property: 'id',
							},
						}),
					);
				},
			}),
		)
		id: string,
	): Promise<User> {
		return this.usersService.getUserOrFail(id);
	}

	@Post()
	@ApiOperation({ summary: 'Create an user' })
	@ApiResponse({ status: HttpStatus.CREATED, type: User })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST })
	@ApiBody({ type: CreateUserDto })
	createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.createUser(createUserDto);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update an user' })
	@ApiResponse({ status: HttpStatus.OK })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST })
	updateUser(
		@Param(
			'id',
			new ParseUUIDPipe({
				exceptionFactory: () => {
					const i18n = I18nContext.current<I18nTranslations>();
					return new BadRequestException(
						i18n.t('validation.IS_UUID', {
							lang: I18nContext.current().lang,
							args: {
								property: 'id',
							},
						}),
					);
				},
			}),
		)
		id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.updateUser(id, updateUserDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete an user' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST })
	async deleteUser(
		@Param(
			'id',
			new ParseUUIDPipe({
				exceptionFactory: () => {
					const i18n = I18nContext.current<I18nTranslations>();
					return new BadRequestException(
						i18n.t('validation.IS_UUID', {
							lang: I18nContext.current().lang,
							args: {
								property: 'id',
							},
						}),
					);
				},
			}),
		)
		id: string,
	) {
		await this.usersService.deleteUser(id);
	}
}
