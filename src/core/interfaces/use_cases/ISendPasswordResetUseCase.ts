import { User } from '@core/types/User';

export interface ISendPasswordResetUseCase {
    execute(user: User): Promise<void>;
}
