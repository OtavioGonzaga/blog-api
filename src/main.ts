import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('Blog')
		.setDescription('Swagger Documentation to Blog endpoints')
		.addOAuth2(
			{
				type: 'oauth2',
				flows: {
					password: {
						tokenUrl: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
						scopes: [],
					},
				},
			},
			'access_token',
		)
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	app.useGlobalPipes(
		new I18nValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	app.useGlobalFilters(new I18nValidationExceptionFilter());

	app.enableCors({
		origin: process.env.FRONTEND_URL,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 204,
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
