import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export const KeycloakId = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const i18n = I18nContext.current<I18nTranslations>();

		const request: Request = ctx.switchToHttp().getRequest();
		const keycloakId: string | undefined = request.headers.sub.toString();

		if (!keycloakId) {
			throw new UnauthorizedException(i18n.t('errors.NOT_AUTHENTICATED'));
		}

		return keycloakId;
	},
);
