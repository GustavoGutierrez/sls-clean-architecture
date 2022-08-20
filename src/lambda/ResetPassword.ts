import 'reflect-metadata';
import { diContainer } from '@framework/util/DIRegister';
import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from '@app/controllers/user.controller';

export const handler: Handler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const userController: UserController = diContainer.resolve('UserController');

    return await userController.passwordReset(event);
};
