import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { I18nService } from 'nestjs-i18n';
import { KeycloakServiceMock } from 'test/mocks/keycloak/keycloak-service.mock';
import {
	mockedUser,
	UserRepositoryMock,
} from 'test/mocks/users/user-repository.mock';
import { UserRoles } from './enums/user-roles.enum';

describe('UsersController', () => {
	let controller: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
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
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should create a new user', async () => {
		const createUserDto = {
			username: 'newuser',
			email: 'newuser@email.com',
			name: 'new user',
			role: UserRoles.STANDARD,
		};

		const user = await controller.createUser(createUserDto);

		expect(user).toBe(mockedUser);
	});

	it('should get all users', async () => {
		const users = await controller.getUsers();

		expect(users).toEqual([mockedUser]);
	});

	it('should get a user by id', async () => {
		const user = await controller.getUser('123');

		expect(user).toBe(mockedUser);
	});

	it('should update a user by id', async () => {
		const updateUserDto = {
			username: 'updateduser',
			email: 'updateduser@email.com',
			name: 'updated user',
			role: UserRoles.ADMIN,
		};

		const user = await controller.updateUser('123', updateUserDto);

		expect(user).toBe(mockedUser);
	});

	it('should delete a user by id', async () => {
		try {
			await controller.deleteUser('123');
		} catch (error) {
			expect(error).toBeNull();
		}
	});
});
