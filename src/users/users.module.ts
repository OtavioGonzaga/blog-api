import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [JwtModule, TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers: [UsersService, KeycloakService],
})
export class UsersModule {}
