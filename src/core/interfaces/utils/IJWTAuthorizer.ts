import { User } from '@core/types/User';
import * as jwt from 'jsonwebtoken';
export interface IJWTAuthorizer {
    authorize(token: string): Promise<null| (User & jwt.JwtPayload)>;
    tokenize(user: any): string;
    refreshToken(user: any): string;
    refreshAuthorize(token: string): Promise<null| (User & jwt.JwtPayload)>;
}
