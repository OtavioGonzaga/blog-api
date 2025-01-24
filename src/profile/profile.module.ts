import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), CloudinaryModule],
	controllers: [ProfileController],
	providers: [ProfileService],
})
export class ProfileModule {}
