import { User } from '@core/types/User';
import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';

export interface IUserRepository {
    registerUser(user: User): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>>;
    passwordChange(email: string, password: string): Promise<void>;
    updateVerifyCode(email: string, code: string): Promise<void>;
    updateVerifyUser(user: Partial<User>): Promise<void>;
    findOneUser(email: string): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>>;
    findAll(): Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>>;
    existEmail(email: string): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>>;
}
