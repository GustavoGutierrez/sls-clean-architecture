import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'tsyringe';
import { ok, badRequest, unauthorized } from 'aws-lambda-utils';
import { Logger } from '@aws-lambda-powertools/logger';
import { LoginSchema } from '@core/types/Login';
import { z, ZodError } from 'zod';
import { UnverifiedUserError } from '@framework/errors';
import { SuspendedAccount } from '@framework/errors/suspended-account.error';
import { IJWTAuthorizer, ILoginUserUseCase, IRefreshTokenUseCase } from '@core/interfaces';

const logger = new Logger({ serviceName: 'AuthController' });
@injectable()
export class AuthController {
    constructor(
        @inject('ILoginUserUseCase') private loginUserUseCase: ILoginUserUseCase,
        @inject('IRefreshTokenUseCase') private refreshTokenUseCase: IRefreshTokenUseCase,
        @inject('IJWTAuthorizer') private auth: IJWTAuthorizer,
    ) {}

    login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const { email, password } = LoginSchema.parse(JSON.parse(event.body || '{}'));

            const user = await this.loginUserUseCase.execute(email, password);

            if (user) {
                const accessToken = await this.auth.tokenize(user);
                const refreshToken = await this.auth.refreshToken(user);
                return ok({
                    accessToken,
                    refreshToken,
                    ...user as any
                });
            } else {
                return badRequest(JSON.stringify({
                    success: false,
                    status: 'UNAUTHORIZED',
                    message: 'Correo electrónico o contraseña incorrectos.'
                }));
            }

        } catch (error) {

            if (error instanceof ZodError) {
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'Correo electrónico o contraseña invalidos.',
                    status: 'UNAUTHORIZED',
                    error: error.issues
                }));
            }

            if (error instanceof UnverifiedUserError) {
                return unauthorized(JSON.stringify({
                    success: false,
                    status: 'UNVERIFIED',
                    message: error.message,
                    error
                }));
            }

            if (error instanceof SuspendedAccount) {
                return unauthorized(JSON.stringify({
                    success: false,
                    status: 'SUSPENDED',
                    message: error.message,
                    error
                }));
            }

            logger.error('ERROR LOGIN', {error});
            return badRequest(JSON.stringify({
                success: false,
                status: 'INTERNAL_ERROR',
                message: 'Error iniciando sesion, por favor intente nuevamente.',
                error
            }));
        }
    };

    refreshToken = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const refreshTokenSchema = z.object({
                refreshToken: z.string()
            });

            const { refreshToken } = refreshTokenSchema.parse(JSON.parse(event.body || '{}'));

            const user = await this.refreshTokenUseCase.execute(refreshToken);

            if (user) {
                const accessToken = await this.auth.tokenize(user);
                const refreshToken = await this.auth.refreshToken(user);
                return ok({
                    accessToken,
                    refreshToken
                });
            } else {
                return badRequest(JSON.stringify({
                    success: false,
                    status: 'UNAUTHORIZED',
                    message: 'Token invalido.'
                }));
            }

        } catch (error) {

            if (error instanceof ZodError) {
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'El token de refresco es necesario.',
                    status: 'UNAUTHORIZED',
                    error: error.issues
                }));
            }

            if (error instanceof UnverifiedUserError) {
                return unauthorized(JSON.stringify({
                    success: false,
                    status: 'UNVERIFIED',
                    message: error.message,
                    error
                }));
            }

            if (error instanceof SuspendedAccount) {
                return unauthorized(JSON.stringify({
                    success: false,
                    status: 'SUSPENDED',
                    message: error.message,
                    error
                }));
            }

            logger.error('ERROR LOGIN', {error});
            return badRequest(JSON.stringify({
                success: false,
                status: 'INTERNAL_ERROR',
                message: 'Error refrescando token, por favor intente nuevamente.',
                error
            }));
        }
    };

}


