import { AWSError, SES } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { injectable } from 'tsyringe';
import { Logger } from '@aws-lambda-powertools/logger';

const loggerSE = new Logger({ serviceName: 'SendEmailRepository' });

@injectable()
export class SendEmailRepository {

    public async sendEmail(email: string, data: any, template: string): Promise<PromiseResult<SES.SendTemplatedEmailResponse, AWSError>> {

        const emailParams: SES.SendTemplatedEmailRequest = {
            'Source': `${data.COMPANY_NAME} <${data.SYSTEM_MANAGER}>`,
            'Template': template,
            'ConfigurationSetName': 'MyCompanyConfigSet',
            'Destination': {
                'ToAddresses': [email]
            },
            'TemplateData': JSON.stringify(data)
        };

        const ses = new SES({ apiVersion: '2010-12-01' });

        loggerSE.info(`Sending email to ${email}`, {emailParams});

        return ses.sendTemplatedEmail(emailParams).promise();
    }
}
