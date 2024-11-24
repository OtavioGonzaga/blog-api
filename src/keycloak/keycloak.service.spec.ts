import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { KeycloakService } from './keycloak.service';
import { RequiredActions } from './enums/required-actions.enum';
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

	it('should create a user in keycloak', async () => {
		const response = await service.createUser({
			email: 'otavio@email.com',
			username: 'newuser',
			name: 'new user',
		});

		keycloakId = response.headers.location.split('/').pop();

		expect(response.status).toBe(HttpStatus.CREATED);
	});

	it('should update user name in keycloak', async () => {
		const response = await service.updateUser(keycloakId, {
			email: 'otavio@email.com',
			name: 'updated user',
		});

		expect(response.status).toBe(HttpStatus.NO_CONTENT);
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
			'd1938617-77b4-499a-97b5-0fb33e3248a0',
			UserRoles.ADMIN,
		);

		expect(response.status).toBe(HttpStatus.NO_CONTENT);
	});

	it('should send a required actions email to user in keycloak', async () => {
		try {
			const response = await service.sendExecuteActionsEmail(keycloakId, [
				RequiredActions.UPDATE_PASSWORD,
				RequiredActions.VERIFY_EMAIL,
			]);

			expect(response.status).toBe(HttpStatus.NO_CONTENT);
		} catch (error) {
			console.log(error);
		}
	});

	it('should delete a user in keycloak', async () => {
		const response = await service.deleteUser(keycloakId);

		expect(response.status).toBe(HttpStatus.NO_CONTENT);
	});
});
