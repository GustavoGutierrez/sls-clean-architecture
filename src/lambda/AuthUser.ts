import 'reflect-metadata';
import { diContainer } from '@framework/util/DIRegister';
import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { AuthController } from '@app/controllers/auth.controller';

export const handler: Handler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const authController: AuthController = diContainer.resolve('AuthController');

    return await authController.login(event);
};
