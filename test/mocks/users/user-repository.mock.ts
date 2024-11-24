import { User } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import * as dotenv from 'dotenv';
import { getRepositoryToken } from '@nestjs/typeorm';
dotenv.config();

export const mockedUser: User = {
	id: 'b553aeb7-0c03-43db-b743-d48ce73d3b51',
	keycloakId: 'b553aeb7-0c03-43db-b743-d48ce73d3b51',
	username: 'john.doe',
	name: 'John Doe',
	email: 'john.doe@example.com',
	role: UserRoles.STANDARD,
	createdAt: new Date(),
	updatedAt: new Date(),
};

export const UserRepositoryMock = {
	provide: getRepositoryToken(User),
	useValue: {
		find: jest.fn().mockResolvedValue([mockedUser]),
		findOne: jest.fn().mockResolvedValue(mockedUser),
		findOneOrFail: jest.fn().mockResolvedValue(mockedUser),
		findOneByOrFail: jest.fn().mockResolvedValue(mockedUser),
		create: jest.fn().mockResolvedValue(mockedUser),
		save: jest.fn().mockResolvedValue(mockedUser),
		update: jest.fn().mockResolvedValue(mockedUser),
		delete: jest.fn(),
	},
};
