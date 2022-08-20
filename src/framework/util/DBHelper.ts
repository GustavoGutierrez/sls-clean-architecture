import { DynamoDB } from 'aws-sdk';
import { Constants } from '@core/common/Constants';
import { DatabaseConnectionError, InternalServerError } from '@framework/errors';
import { IDBHelper } from '@core/interfaces';
// import { Logger } from '@aws-lambda-powertools/logger';
// const logger = new Logger({ serviceName: 'DBHelper' });

export class DBHelper implements IDBHelper {
    private docClient: DynamoDB.DocumentClient;

    constructor() {
        const options: any = {
            apiVersion: Constants.dynamoDBAPIVersion,
            region: Constants.region,
        };

        if (process.env.STAGE === 'local') {
            options.region = 'localhost';
            options.endpoint = 'http://localhost:8001';
        }
        try {
            this.docClient = new DynamoDB.DocumentClient(options);
        } catch (error) {
            throw new DatabaseConnectionError();
        }
    }

    findByEmail = async (tableName: string, email: string, fields: string) => {
        try {
            const params: DynamoDB.DocumentClient.ScanInput = {
                FilterExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email,
                },
                ProjectionExpression: fields,
                TableName: tableName,
            };

            return await this.docClient.scan(params).promise();

        } catch (error) {
            throw new InternalServerError('Error finding user by email', error);
        }
    };


    list = async (tableName: string, fields: string='') => {
        const params: DynamoDB.DocumentClient.ScanInput = {
            ProjectionExpression: fields,
            TableName: tableName,
        };

        return await this.docClient.scan(params).promise();
    };

    filter = async (params:  DynamoDB.DocumentClient.ScanInput) => {
        return await this.docClient.scan(params).promise();
    };

    get = async (tableName: string, id: string) => {
        const input: DynamoDB.DocumentClient.GetItemInput = {
            TableName: tableName,
            Key: {
                id,
            },
        };

        return await this.docClient.get(input).promise();
    };

    find = async (tableName: string, keyObject: any) => {
        const input: DynamoDB.DocumentClient.GetItemInput = {
            TableName: tableName,
            Key: keyObject
        };

        return await this.docClient.get(input).promise();
    };

    getByEmail = async (tableName: string, email: string) => {
        const input: DynamoDB.DocumentClient.GetItemInput = {
            TableName: tableName,
            Key: {
                email,
            },
        };

        return await this.docClient.get(input).promise();
    };

    existEmail = async (tableName: string, email: string) => {
        const input: DynamoDB.DocumentClient.GetItemInput = {
            TableName: tableName,
            Key: {
                email,
            },
            ProjectionExpression: 'email',
        };

        return await this.docClient.get(input).promise();
    };

    /**
     * Crea un item en la tabla
     * @param tableName
     * @param item
     */
    put = async (tableName: string, item: { [key: string]: any }) => {
        const input: DynamoDB.DocumentClient.PutItemInput = {
            TableName: tableName,
            Item: item
        };
        return await this.docClient.put(input).promise();
    };

    /**
     * Delete an item from the table
     * @param tableName
     * @param email
     * */
    delete = async (tableName: string, filter: any) => {
        const input: DynamoDB.DocumentClient.DeleteItemInput = {
            TableName: tableName,
            Key: filter
        };
        await this.docClient.delete(input).promise();
    };

    updateItem = async (tableName: string, input: DynamoDB.DocumentClient.UpdateItemInput ) => {
        return await this.docClient.update(input).promise();
    };
}
