import { IConfigManager, ISendEmailRepository, ISendPasswordResetUseCase, IUserRepository } from '@core/interfaces';
import { User } from '@core/types/User';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
// import { Logger } from '@aws-lambda-powertools/logger';
// const logger = new Logger({ serviceName: 'SendConfirmationMailUseCase' });

@injectable()
export class SendPasswordResetUseCase implements ISendPasswordResetUseCase {
    constructor(
        @inject('IConfigManager') private configManager: IConfigManager,
        @inject('ISendEmailRepository') private sendEmailRepository: ISendEmailRepository,
        @inject('IUserRepository') private userRepository: IUserRepository
    ) {}

    execute = async (user: User) => {
        const SYSTEM_MANAGER = await this.configManager.getSystemEmailFromParamStore;
        const EMAIL_TEMPLATES = await this.configManager.getEmailTemplatesFromParamStore;

        if (EMAIL_TEMPLATES) {
            const code = uuidv4();
            this.userRepository.updateVerifyCode(user.email, code);

            const data = {
                SYSTEM_MANAGER,
                USER_EMAIL: user.email,
                USER_NAME: user.fullname,
                COMPANY_NAME: 'Company Name',
                URL_RESET_PASSWORD: `https://${process.env.HOST}/password-reset/${user.email}/${code}`
            };
            await this.sendEmailRepository.sendEmail(user.email, data, EMAIL_TEMPLATES.ResetEmail.TemplateName);
        }

    };
}
