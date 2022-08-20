
import { AWSError, SES } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

export interface ISendEmailRepository {
   sendEmail(email: string, data: any, template: string): Promise<PromiseResult<SES.SendTemplatedEmailResponse, AWSError>>;
}
