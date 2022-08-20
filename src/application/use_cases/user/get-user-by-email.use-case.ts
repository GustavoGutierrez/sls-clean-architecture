import { inject, injectable } from 'tsyringe';
import { User } from '@core/types/User';
import { IGetUserByUseCase, IUserRepository } from '@core/interfaces';

@injectable()
export class GetUserByUseCase implements IGetUserByUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository
    ) {}

    execute = async (email: string) => {
        const userExist = await this.userRepo.findOneUser(email);
        if (userExist.Item) {
            return userExist.Item as User;
        }
        return null;
    };
}
