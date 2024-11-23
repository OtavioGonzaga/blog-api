import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
	controllers: [UsersController],
	providers: [UsersService, KeycloakService],
	imports: [JwtModule],
})
export class UsersModule {}
