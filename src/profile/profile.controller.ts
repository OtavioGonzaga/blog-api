import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Resource } from 'nest-keycloak-connect';
import { User } from 'src/users/entities/user.entity';
import { KeycloakId } from 'src/decorators/user-id.decorator';

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
}
