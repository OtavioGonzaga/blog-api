import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export const KeycloakId = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const i18n = I18nContext.current<I18nTranslations>();

		const request: Request = ctx.switchToHttp().getRequest();
		const token = request.headers.authorization?.split(' ')[1];

		if (!token) {
			throw new UnauthorizedException(i18n.t('errors.NOT_AUTHENTICATED'));
		}

		const jwtService = new JwtService();

		const { sub } = jwtService.decode<{ sub: string }>(token);

		return sub;
	},
);
