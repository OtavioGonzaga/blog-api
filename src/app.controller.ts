import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public, Resource, Scopes } from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { KeycloakService } from './keycloak/keycloak.service';

@Controller()
@Resource('app')
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly keycloakService: KeycloakService,
	) {}

	@Get()
	@Public()
	@Scopes('public')
	@ApiOperation({ summary: 'Get "Hello World"' })
	getHello(): string {
		return this.appService.getHello();
	}
}
