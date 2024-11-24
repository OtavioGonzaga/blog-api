import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		private readonly keycloakService: KeycloakService,
		private readonly i18n: I18nService<I18nTranslations>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	private readonly logger = new Logger(UsersService.name);

	async getUsers(): Promise<User[]> {
		return await this.usersRepository.find();
	}

	async getUserOrFail(id: string): Promise<User> {
		try {
			return await this.usersRepository.findOneByOrFail({ id });
		} catch (err) {
			if (err instanceof EntityNotFoundError)
				throw new NotFoundException(
					this.i18n.t('errors.NOT_FOUND', {
						args: { entity: this.i18n.t('t.USERS.USER') },
					}),
				);

			this.logger.error(err);

			throw err;
		}
	}

	async createUser({
		username,
		email,
		name,
		role,
	}: CreateUserDto): Promise<User> {
		const keycloakId: string = (
			await this.keycloakService.createUser({
				email,
				username,
				name,
			})
		).headers.location
			.split('/')
			.pop();

		const newUser = this.usersRepository.create({
			keycloakId,
			email,
			name,
			role,
			username,
		});

		try {
			return await this.usersRepository.save(newUser);
		} catch (error) {
			this.keycloakService.deleteUser(keycloakId);

			this.logger.error(error);

			throw error;
		}
	}

	async updateUser(id: string, data: UpdateUserDto): Promise<User> {
		const userUpdated = this.usersRepository.create({ id, ...data });

		try {
			return await this.usersRepository.save(userUpdated);
		} catch (error) {
			this.logger.error(error);

			throw error;
		}
	}

	async deleteUser(id: string): Promise<void> {
		try {
			await this.usersRepository.delete(id);
		} catch (err) {
			this.logger.error(err);

			throw err;
		}
	}
}
