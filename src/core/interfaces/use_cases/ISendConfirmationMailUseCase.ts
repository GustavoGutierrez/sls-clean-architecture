import { User } from '@core/types/User';

export interface ISendConfirmationMailUseCase {
    execute(user: User): Promise<void>;
}
