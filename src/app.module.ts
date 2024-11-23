import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	AuthGuard,
	KeycloakConnectModule,
	PolicyEnforcementMode,
	ResourceGuard,
	RoleGuard,
	TokenValidation,
} from 'nest-keycloak-connect';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { AppDataSource } from 'typeorm/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot({ isGlobal: true }),
		KeycloakConnectModule.register({
			authServerUrl: process.env.KEYCLOAK_URL,
			realm: process.env.KEYCLOAK_REALM,
			clientId: process.env.KEYCLOAK_CLIENT_ID,
			secret: process.env.KEYCLOAK_CLIENT_SECRET,
			policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
			tokenValidation: TokenValidation.ONLINE,
			useNestLogger: false,
		}),
		I18nModule.forRoot({
			fallbackLanguage: 'en-US',
			loaderOptions: {
				path: path.join(__dirname, '/i18n/'),
				watch: true,
			},
			typesOutputPath: path.join('src/generated/i18n.generated.ts'),
			resolvers: [
				{ use: QueryResolver, options: ['lang', 'locale'] },
				AcceptLanguageResolver,
			],
		}),
		TypeOrmModule.forRoot(AppDataSource.options),
		JwtModule,
		PostsModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: ResourceGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RoleGuard,
		},
	],
})
export class AppModule {}
