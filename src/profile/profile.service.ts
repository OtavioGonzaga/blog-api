import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { User } from 'src/users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly i18n: I18nService<I18nTranslations>,
		private readonly cloudinaryService: CloudinaryService,
	) {}

	private readonly logger = new Logger(ProfileService.name);

	public get(keycloakId: string): Promise<User> {
		return this.usersRepository.findOneBy({ keycloakId });
	}

	public async update({
		keycloakId,
		user,
	}: {
		keycloakId: string;
		user: Partial<Omit<User, 'id' | 'keycloakId' | 'email' | 'username'>>;
	}): Promise<UpdateResult> {
		return this.usersRepository.update({ keycloakId }, user);
	}

	public async uploadProfilePicture({
		keycloakId,
		picture,
	}: {
		keycloakId: string;
		picture: Express.Multer.File;
	}): Promise<void> {
		const response = await this.cloudinaryService.uploadFile(picture);

		await this.deleteProfilePicture(keycloakId);

		await this.update({
			keycloakId,
			user: { pictureUrl: response.secure_url },
		});
	}

	public async deleteProfilePicture(keycloakId: string): Promise<void> {
		const user = await this.get(keycloakId);

		if (user.pictureUrl) {
			const publicId = user.pictureUrl
				.split('/')
				.pop()
				.split('?')[0]
				.split('.')[0];

			await this.cloudinaryService.deleteFile(publicId);

			await this.update({ keycloakId, user: { pictureUrl: null } });
		}
	}
}
