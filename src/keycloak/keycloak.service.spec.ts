import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { KeycloakService } from './keycloak.service';
dotenv.config();

describe('KeycloakService', () => {
	let service: KeycloakService;
	let keycloakId: string;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [KeycloakService, JwtService],
		}).compile();

		service = module.get<KeycloakService>(KeycloakService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a user in keycloak', async () => {
		const response = await service.createUser({
			username: 'newuser',
			email: 'new-user@example.com',
			name: 'new user',
			enabled: true,
		});

		keycloakId = response.headers.location.split('/').pop();

		expect(response.status).toBe(HttpStatus.CREATED);
	});

	it('should assign a role to user in keycloak', async () => {
		const response = await service.assingUserRole(
			keycloakId,
			UserRoles.ADMIN,
		);

		expect(response.status).toBe(HttpStatus.NO_CONTENT);
	});

	it('should remove a role to user in keycloak', async () => {
		const response = await service.removeUserRole(
			keycloakId,
			UserRoles.ADMIN,
		);

		expect(response.status).toBe(HttpStatus.NO_CONTENT);
	});

	it('should delete a user in keycloak', async () => {
		const response = await service.deleteUser(keycloakId);

		expect(response.status).toBe(HttpStatus.NO_CONTENT);
	});
});
