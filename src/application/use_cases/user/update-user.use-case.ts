import { inject, injectable } from 'tsyringe';
import { User } from '@core/types/User';
import { IConfigManager, ISendConfirmationMailUseCase, IUpdateUserUseCase, IUserRepository } from '@core/interfaces';

@injectable()
export class UpdateUserUseCase implements IUpdateUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('IConfigManager') private cacheManager: IConfigManager,
        @inject('ISendConfirmationMailUseCase')
        private sendMail: ISendConfirmationMailUseCase
    ) {}

    execute = async (user: User) => {
        // await this.userRepo.updateUser(user);
        // await this.sendMail.execute();
    };
}
