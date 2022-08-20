import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

export interface IDBHelper {
    put(tableName: string, item: { [key: string]: any }): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>>;
    delete(tableName: string, filter: { [key: string]: any }): void;
    updateItem(tableName: string, input: DynamoDB.DocumentClient.UpdateItemInput): void;
    get(tableName: string, id: string): Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWSError>>;
    find(tableName: string, keyObject: any): Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWSError>>;
    list(tableName: string, fields: string): Promise<PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>>;
    filter(params:  DynamoDB.DocumentClient.ScanInput): Promise<PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>>;
    findByEmail(tableName: string, email: string, fields: string): Promise<PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>>;
    getByEmail(tableName: string, email: string): Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWSError>>;
    existEmail(tableName: string, email: string): Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWSError>>;
}
