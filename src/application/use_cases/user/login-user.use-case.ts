import { inject, injectable } from 'tsyringe';
import { User } from '@core/types/User';
import { IAuthRepository, ILoginUserUseCase } from '@core/interfaces';

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        @inject('IAuthRepository') private loginRepo: IAuthRepository
    ) {}

    execute = async (email: string, password: string): Promise<Partial<User> | boolean> => {
        return await this.loginRepo.auth(email, password);
    };
}
