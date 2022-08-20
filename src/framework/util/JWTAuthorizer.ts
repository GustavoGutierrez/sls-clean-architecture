import { inject, injectable } from 'tsyringe';
import * as jwt from 'jsonwebtoken';
import { User } from '@core/types/User';
import { ICacheManager, IJWTAuthorizer } from '@core/interfaces';
// import { Logger } from '@aws-lambda-powertools/logger';
// const logger = new Logger({ serviceName: 'JWTAuthorizer' });
@injectable()
export class JWTAuthorizer implements IJWTAuthorizer {

    constructor(@inject('ICacheManager') private cacheManager: ICacheManager) {}

    tokenize(user: any): string {
        const config = {
            audience: process.env.TOKEN_AUDIENCE,
            issuer: process.env.TOKEN_ISSUER,
            expiresIn: process.env.TOKEN_EXPIRES_IN,
        };
        const secret: jwt.Secret = process.env.TOKEN_SECRET as string;
        const token = jwt.sign(user, secret, config);
        return token;
    }

    authorize(authorizationToken: string): Promise<null| (User & jwt.JwtPayload)> {
        return new Promise((resolve, reject) => {
            const token = authorizationToken.replace(/Bearer /g, '');
            const config = {
                audience: process.env.TOKEN_AUDIENCE,
                issuer: process.env.TOKEN_ISSUER,
            };
            const secret: jwt.Secret = process.env.TOKEN_SECRET as string;

            // verify the token with publicKey and config and return proper AWS policy document
            jwt.verify(token, secret, config, (err, verified) => {
                if (err) {
                    // console.error('JWT Error', err, err.stack);
                    // callback(null, denyPolicy('anonymous', event.methodArn));
                    resolve(null);
                } else {
                    // callback(null, allowPolicy(verified.sub, event.methodArn));
                    resolve(verified as (User & jwt.JwtPayload));
                }
            });
        });
    }

    refreshToken(user: any): string {
        const config = {
            audience: process.env.TOKEN_AUDIENCE,
            issuer: process.env.TOKEN_ISSUER,
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        };
        const secret: jwt.Secret = process.env.REFRESH_TOKEN_SECRET as string;
        const refreshToken = jwt.sign(user, secret, config);
        return refreshToken;
    }

    refreshAuthorize(authorizationToken: string): Promise<null| (User & jwt.JwtPayload)> {
        return new Promise((resolve, reject) => {
            const token = authorizationToken.replace(/Bearer /g, '');
            const config = {
                audience: process.env.TOKEN_AUDIENCE,
                issuer: process.env.TOKEN_ISSUER,
            };
            const secret: jwt.Secret = process.env.REFRESH_TOKEN_SECRET as string;

            jwt.verify(token, secret, config, (err, verified) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(verified as (User & jwt.JwtPayload));
                }
            });
        });
    }

}
