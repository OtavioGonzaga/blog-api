import {
	ConflictException,
	HttpStatus,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserRoles } from './enums/user-roles.enum';
import { RequiredActions } from 'src/keycloak/enums/required-actions.enum';
import { AxiosError } from 'axios';

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
		try {
			const keycloakId: string = (
				await this.keycloakService.createUser({
					email,
					username,
					name,
					requiredActions: [
						RequiredActions.UPDATE_PASSWORD,
						RequiredActions.VERIFY_EMAIL,
					],
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
				if (role === UserRoles.ADMIN)
					await this.keycloakService.assingUserRole(
						keycloakId,
						UserRoles.ADMIN,
					);

				await this.keycloakService.sendExecuteActionsEmail(
					newUser.keycloakId,
					[
						RequiredActions.UPDATE_PASSWORD,
						RequiredActions.VERIFY_EMAIL,
					],
				);

				return this.usersRepository.save(newUser);
			} catch (error) {
				this.keycloakService.deleteUser(keycloakId);

				throw error;
			}
		} catch (error) {
			if (
				error instanceof AxiosError &&
				error.status === HttpStatus.CONFLICT
			)
				throw new ConflictException(
					this.i18n.t('errors.ALREADY_EXISTS', {
						args: { entity: this.i18n.t('t.USERS.USER') },
					}),
				);

			this.logger.error(error);

			throw error;
		}
	}

	async updateUser(id: string, data: UpdateUserDto): Promise<User> {
		try {
			const userUpdated = this.usersRepository.create({ id, ...data });

			const user = await this.usersRepository.findOneByOrFail({ id });

			if (
				user.role !== UserRoles.STANDARD &&
				data.role === UserRoles.ADMIN
			)
				await this.keycloakService.assingUserRole(
					user.keycloakId,
					UserRoles.ADMIN,
				);

			if (
				user.role === UserRoles.ADMIN &&
				data.role === UserRoles.STANDARD
			)
				await this.keycloakService.removeUserRole(
					user.keycloakId,
					UserRoles.ADMIN,
				);

			if (data.name)
				await this.keycloakService.updateUser(user.keycloakId, {
					name: data.name,
					email: user.email,
				});

			try {
				return await this.usersRepository.save(userUpdated);
			} catch (error) {
				if (
					user.role === UserRoles.STANDARD &&
					data.role === UserRoles.ADMIN
				)
					await this.keycloakService.removeUserRole(
						user.keycloakId,
						UserRoles.ADMIN,
					);

				if (
					user.role === UserRoles.ADMIN &&
					data.role === UserRoles.STANDARD
				)
					await this.keycloakService.assingUserRole(
						user.keycloakId,
						UserRoles.ADMIN,
					);

				throw error;
			}
		} catch (error) {
			if (error instanceof EntityNotFoundError)
				throw new NotFoundException(
					this.i18n.t('errors.NOT_FOUND', {
						args: { entity: this.i18n.t('t.USERS.USER') },
					}),
				);

			this.logger.error(error);

			throw error;
		}
	}

	async deleteUser(id: string): Promise<void> {
		try {
			const { keycloakId } = await this.usersRepository.findOneOrFail({
				where: { id },
				select: { keycloakId: true },
			});

			await Promise.all([
				this.keycloakService.deleteUser(keycloakId),
				this.usersRepository.delete(id),
			]);
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
}
