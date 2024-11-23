import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [JwtModule],
	controllers: [UsersController],
	providers: [UsersService, KeycloakService],
})
export class UsersModule {}
