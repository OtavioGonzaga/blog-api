import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { KeycloakServiceMock } from 'test/mocks/keycloak/keycloak-service.mock';
import {
	mockedUser,
	UserRepositoryMock,
} from 'test/mocks/users/user-repository.mock';
import { UserRoles } from './enums/user-roles.enum';
import { UsersService } from './users.service';

describe('UsersService', () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				KeycloakServiceMock,
				UserRepositoryMock,
				{
					provide: I18nService,
					useValue: {
						translate: jest.fn(), // Mock inicial do método translate
					},
				},
			],
			imports: [JwtModule],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should create a new user', async () => {
		const user = await service.createUser({
			username: 'testuser',
			email: 'test@example.com',
			name: 'Test User',
			role: UserRoles.STANDARD,
		});

		expect(user).toBe(mockedUser);
	});

	it('should get all users', async () => {
		const users = await service.getUsers();

		expect(users).toEqual([mockedUser]);
	});

	it('should get a user by id', async () => {
		const user = await service.getUserOrFail(mockedUser.id);

		expect(user).toBe(mockedUser);
	});

	it('should update the user', async () => {
		const updatedUser = await service.updateUser(mockedUser.id, {
			role: UserRoles.ADMIN,
			name: 'Updated User',
		});

		expect(updatedUser).toBe(mockedUser);
	});

	it('should delete the user', async () => {
		try {
			await service.deleteUser(mockedUser.id);
		} catch (error) {
			expect(error).toBeNull();
		}
	});
});
