import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakService } from './keycloak.service';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { HttpStatus } from '@nestjs/common';
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

	it('should generate a Keycloak token', async () => {
		const token = await service.generateKeycloakToken();

		expect(token).toBeDefined();
		expect(typeof token).toBe('string');
	});

	it('should create a user in keycloak', async () => {
		const response = await service.createUser({
			username: 'newuser',
			email: 'new-user@example.com',
			firstName: 'New',
			lastName: 'User',
			enabled: true,
		});

		keycloakId = response.headers.location.split('/').pop();

		expect(response.status).toBe(HttpStatus.CREATED);
	});

	it('should delete a user in keycloak', async () => {
		const response = await service.deleteUser(keycloakId);

		expect(response.status).toBe(HttpStatus.NO_CONTENT);
	});
});
