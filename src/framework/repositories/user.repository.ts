import { inject, injectable } from 'tsyringe';
import { User } from '@core/types/User';
import { DynamoDB } from 'aws-sdk';
import { IDBHelper, IUserRepository } from '@core/interfaces';
// import { Logger } from '@aws-lambda-powertools/logger';
// const logger = new Logger({ serviceName: 'UserRepository' });

const tableNameUser: string = process.env.USER_TABLE || 'user';

@injectable()
export class UserRepository implements IUserRepository {

    constructor(@inject('IDBHelper') private dbHelper: IDBHelper) {}

    public async registerUser(user: User) {
        return await this.dbHelper.put(tableNameUser, user);
    }

    public async updateVerifyUser(user: Partial<User>){

        const input: DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: tableNameUser,
            Key: {
                email: user.email,
            },
            UpdateExpression: 'set #verified = :verified, #verificationcode = :verificationcode',
            ExpressionAttributeNames: {
                '#verificationcode': 'verification_code',
                '#verified': 'verified'
            },
            ExpressionAttributeValues: {
                ':verified': true,
                ':verificationcode': ''
            },
        };

        await this.dbHelper.updateItem(tableNameUser, input);
    }

    public async passwordChange(email: string, password: string) {

        const input: DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: tableNameUser,
            Key: {
                email,
            },
            UpdateExpression: 'set #password = :password, #verificationcode = :verificationcode',
            ExpressionAttributeNames: {
                '#verificationcode': 'verification_code',
                '#password': 'password'
            },
            ExpressionAttributeValues: {
                ':password': password,
                ':verificationcode': ''
            },
        };

        await this.dbHelper.updateItem(tableNameUser, input);
    }

    public async updateVerifyCode(email: string, code: string) {

        const input: DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: tableNameUser,
            Key: {
                email,
            },
            UpdateExpression: 'set #verificationcode = :verificationcode',
            ExpressionAttributeNames: {
                '#verificationcode': 'verification_code'
            },
            ExpressionAttributeValues: {
                ':verificationcode': code
            },
        };

        await this.dbHelper.updateItem(tableNameUser, input);
    }

    public async findOneUser(email: string) {
        return await this.dbHelper.getByEmail(tableNameUser, email);
    }

    public async existEmail(email: string) {
        return await this.dbHelper.existEmail(tableNameUser, email);
    }

    public async findAll(){
        return await this.dbHelper.list(tableNameUser, 'fullname, email, phone, avatar, verified, active, realm');
    }
}
