import { User } from '@core/types/User';

export interface ILoginUserUseCase {
    execute(email: string, password: string): Promise<Partial<User> | boolean>;
}
