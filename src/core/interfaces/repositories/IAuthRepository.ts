import { User } from '@core/types/User';

export interface IAuthRepository {
    auth(email: string, password: string): Promise<Partial<User> | boolean>;
}
