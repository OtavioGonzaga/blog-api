import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { KeycloakService } from 'src/keycloak/keycloak.service';

@Injectable()
export class UsersService {
	constructor(private readonly keycloakService: KeycloakService) {}

	async createUser({ username, email, name, role }: CreateUserDto) {
		try {
			// this.keycloakService.createUser({ email, username });

			return '';
		} catch (error) {}
	}
}
