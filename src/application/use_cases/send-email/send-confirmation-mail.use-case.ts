import { IConfigManager, ISendConfirmationMailUseCase, ISendEmailRepository } from '@core/interfaces';
import { User } from '@core/types/User';
import { inject, injectable } from 'tsyringe';
// import { Logger } from '@aws-lambda-powertools/logger';
// const logger = new Logger({ serviceName: 'SendConfirmationMailUseCase' });

@injectable()
export class SendConfirmationMailUseCase implements ISendConfirmationMailUseCase {
    constructor(
        @inject('IConfigManager') private configManager: IConfigManager,
        @inject('ISendEmailRepository') private sendEmailRepository: ISendEmailRepository
    ) {}

    execute = async (user: User) => {
        const SYSTEM_MANAGER = await this.configManager.getSystemEmailFromParamStore;
        const EMAIL_TEMPLATES = await this.configManager.getEmailTemplatesFromParamStore;

        if (EMAIL_TEMPLATES) {
            const data = {
                SYSTEM_MANAGER: SYSTEM_MANAGER,
                USER_EMAIL: user.email,
                USER_NAME: user.fullname,
                COMPANY_NAME: 'Company Name',
                URL_CONFIRM_EMAIL: `https://${process.env.HOST}/confirm-email/${user.email}/${user.verification_code}`
            };
            await this.sendEmailRepository.sendEmail(user.email, data, EMAIL_TEMPLATES.ConfirmEmail.TemplateName);
        }

    };
}
