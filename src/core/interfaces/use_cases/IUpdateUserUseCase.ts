import { User } from '@core/types/User';

export interface IUpdateUserUseCase {
    execute(user: User): Promise<void>;
}
