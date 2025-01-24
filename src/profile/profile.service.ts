import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly i18n: I18nService<I18nTranslations>,
		private readonly cloudinaryService: CloudinaryService,
	) {}

	private readonly logger = new Logger(ProfileService.name);

	public get(keycloakId: string) {
		return this.usersRepository.findOneBy({ keycloakId });
	}

	public async update({
		keycloakId,
		user,
	}: {
		keycloakId: string;
		user: Partial<Omit<User, 'id' | 'keycloakId' | 'email' | 'username'>>;
	}) {
		return this.usersRepository.update({ keycloakId }, user);
	}

	public async uploadProfilePicture({
		keycloakId,
		picture,
	}: {
		keycloakId: string;
		picture: Express.Multer.File;
	}) {
		const response = await this.cloudinaryService.uploadFile(picture);

		return this.update({
			keycloakId,
			user: { pictureUrl: response.secure_url },
		});
	}
}
