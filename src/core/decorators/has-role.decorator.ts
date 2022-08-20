import 'reflect-metadata';
import { Logger } from '@aws-lambda-powertools/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { unauthorized } from 'aws-lambda-utils';
import { JWTAuthorizer } from '@framework/util/JWTAuthorizer';
import { diContainer } from '@framework/util/DIRegister';
import { Constants } from '@core/common/Constants';
import { ICacheManager } from '@core/interfaces';

const logger = new Logger({ serviceName: 'HasRole' });

export function HasRole(roles: string[]) {

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor)=> {
        const originalMethod = descriptor.value;
        descriptor.value = async function(event: APIGatewayProxyEvent) {
            const duration = Constants.duration;
            const authorizer: JWTAuthorizer = diContainer.resolve(JWTAuthorizer);
            const cacheManager: ICacheManager = diContainer.resolve('ICacheManager');

            const token = event.headers.Authorization;
            if (!token) {
                logger.error('User not found', {});
                return unauthorized(JSON.stringify({
                    success: false,
                    status: 403,
                    message: 'Usuario no autorizado.'
                }));
            }

            const payload = await authorizer.authorize(token);

            if (!payload) {
                logger.error('User not found', {payload});
                return unauthorized(JSON.stringify({
                    success: false,
                    status: 403,
                    message: 'Usuario no autorizado.'
                }));
            }
            logger.info(`Decorator Roles: ${roles}`, { email: payload.email, exp: payload.exp, now: Math.ceil(Date.now()/1000) });

            if (payload.exp && (payload.exp * 1000  <  Date.now())) {
                logger.error('Token expired', {payload});
                return unauthorized(JSON.stringify({
                    success: false,
                    status: 403,
                    message: 'Token expirado.'
                }));
            }

            if (!roles.includes(payload.realm)) {
                logger.error('User not authorized', {realm: payload.realm});
                return unauthorized(JSON.stringify({
                    success: false,
                    status: 401,
                    message: 'Usuario no autorizado.'
                }));
            }


            cacheManager.put('authUser', payload, duration);
            // eslint-disable-next-line prefer-rest-params
            return await originalMethod.apply(this, arguments);
        };
    };

}
