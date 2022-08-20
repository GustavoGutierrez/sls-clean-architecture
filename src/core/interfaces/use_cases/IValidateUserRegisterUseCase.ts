import { User } from '@core/types/User';
import { APIGatewayProxyEvent } from 'aws-lambda';

export interface IValidateUserRegisterUseCase {
    execute(event: APIGatewayProxyEvent): Promise<User>;
}
