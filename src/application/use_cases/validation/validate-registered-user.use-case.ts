import { IConfigManager, ISendConfirmationMailUseCase, IUserRepository, IValidateRegisteredUserUseCase } from '@core/interfaces';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ValidateRegisteredUserUseCase implements IValidateRegisteredUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('IConfigManager') private cacheManager: IConfigManager,
        @inject('ISendConfirmationMailUseCase')
        private sendMail: ISendConfirmationMailUseCase
    ) {}

    execute = async (email: string) => {
        const userExist = await this.userRepo.existEmail(email);
        if (userExist.Item) {
            return true;
        }
        return false;
    };
}
