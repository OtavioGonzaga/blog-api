import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Resource } from 'nest-keycloak-connect';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('/users')
@Resource('users')
@ApiBearerAuth('access_token')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiOperation({ summary: 'Create an user' })
	@ApiResponse({ status: HttpStatus.CREATED })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST })
	@ApiBody({ type: CreateUserDto })
	async createUser(@Body() createUserDto: CreateUserDto) {
		return await this.usersService.createUser(createUserDto);
	}
}
