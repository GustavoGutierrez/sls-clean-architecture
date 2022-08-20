import { User } from '@core/types/User';

export interface ISendPasswordChangeUseCase {
    execute(user: User,newPassword:string): Promise<void>;
}
