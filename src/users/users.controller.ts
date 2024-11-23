import { Controller, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Create an user' })
	@ApiResponse({ status: HttpStatus.CREATED })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST })
	async createUser(createUserDto: CreateUserDto) {
		return await this.usersService.createUser(createUserDto);
	}
}
