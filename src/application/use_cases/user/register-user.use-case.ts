import { inject, injectable } from 'tsyringe';
import { User } from '@core/types/User';
import { IRegisterUserUseCase, IUserRepository } from '@core/interfaces';

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository
    ) {}

    execute = async (user: User) => {
        return await this.userRepo.registerUser(user);
    };
}
