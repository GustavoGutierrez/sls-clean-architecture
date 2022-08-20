import { IConfigManager, IEmailNotifyConfig, ISendEmailNotificationUseCase, ISendEmailRepository } from '@core/interfaces';
import { inject, injectable } from 'tsyringe';
// import { Logger } from '@aws-lambda-powertools/logger';
// const logger = new Logger({ serviceName: 'SendConfirmationMailUseCase' });

@injectable()
export class SendEmailNotificationUseCase implements ISendEmailNotificationUseCase {
    constructor(
        @inject('IConfigManager') private configManager: IConfigManager,
        @inject('ISendEmailRepository') private sendEmailRepository: ISendEmailRepository
    ) {}

    execute = async (config: IEmailNotifyConfig) => {
        const SYSTEM_MANAGER = await this.configManager.getSystemEmailFromParamStore;
        const EMAIL_TEMPLATES = await this.configManager.getEmailTemplatesFromParamStore;

        if (EMAIL_TEMPLATES) {
            const data = {
                NOTIFICATION_BODY: config.body,
                NOTIFICATION_HEADER: config.subject,
                NOTIFICATION_FOOTER: config.footer,
                COMPANY_NAME: 'Company Name',
                SYSTEM_MANAGER
            };
            await this.sendEmailRepository.sendEmail(config.to, data, EMAIL_TEMPLATES.Notification.TemplateName);
        }

    };
}
