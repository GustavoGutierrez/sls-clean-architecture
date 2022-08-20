import 'reflect-metadata';
import { diContainer } from '@framework/util/DIRegister';
import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { SeedController } from '@app/controllers/seed.controller';

export const handler: Handler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const seedController: SeedController = diContainer.resolve('SeedController');
    return await seedController.seed(event);

};
