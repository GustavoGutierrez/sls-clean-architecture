import { User } from '@core/types/User';

export interface IGetUserByUseCase {
    execute(email: string): Promise<User | null>;
}
