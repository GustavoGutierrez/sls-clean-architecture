import { User } from '@core/types/User';
import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';

export interface IRegisterUserUseCase {
    execute(user: User): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>>;
}
