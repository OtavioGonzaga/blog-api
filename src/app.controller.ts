import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public, Resource, Scopes } from 'nest-keycloak-connect';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
@Resource('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @Scopes('public')
  @ApiOperation({ summary: 'Get "Hello World"' })
  getHello(): string {
    return this.appService.getHello();
  }
}
