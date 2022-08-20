import { IConfigManager, ISendEmailRepository, ISendPasswordChangeUseCase, IUserRepository } from '@core/interfaces';
import { User } from '@core/types/User';
import { genSalt, hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
// import { Logger } from '@aws-lambda-powertools/logger';
// const logger = new Logger({ serviceName: 'SendConfirmationMailUseCase' });

@injectable()
export class SendPasswordChangeUseCase implements ISendPasswordChangeUseCase {
    constructor(
        @inject('IConfigManager') private configManager: IConfigManager,
        @inject('ISendEmailRepository') private sendEmailRepository: ISendEmailRepository,
        @inject('IUserRepository') private userRepository: IUserRepository
    ) {}

    execute = async (user: User, newPassword: string) => {
        const SYSTEM_MANAGER = await this.configManager.getSystemEmailFromParamStore;
        const EMAIL_TEMPLATES = await this.configManager.getEmailTemplatesFromParamStore;

        if (EMAIL_TEMPLATES) {
            const salt = await genSalt(10);
            const newPasswordHash = await hash(newPassword, salt);
            await this.userRepository.passwordChange(user.email, newPasswordHash);

            const data = {
                SYSTEM_MANAGER,
                USER_EMAIL: user.email,
                USER_NAME: user.fullname,
                COMPANY_NAME: 'Company Name',
                NEW_PASSWORD: newPassword,
            };

            await this.sendEmailRepository.sendEmail(user.email, data, EMAIL_TEMPLATES.PasswordChange.TemplateName);
        }

    };
}
