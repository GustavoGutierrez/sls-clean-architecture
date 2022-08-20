import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'tsyringe';
import { Logger } from '@aws-lambda-powertools/logger';
import { badRequest, ok, unauthorized } from 'aws-lambda-utils';
import { IDBSeeder } from '@core/database/seeders';
import { IConfigManager } from '@core/interfaces';

const loggerSeed = new Logger({ serviceName: 'Database: Seeding' });
@injectable()
export class SeedController {
    constructor(
        @inject('IDBSeeder') private dbSeeder: IDBSeeder,
        @inject('IConfigManager') private configManager: IConfigManager
    ) {
    }

    async seed(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

        loggerSeed.info('Seeder called');

        // API KEY de serverless
        // eventos sobre lamdas desde resursos aws

        try {
            const SEED_ENABLED= await this.configManager.getSeedEnabledFromParamStore;

            if (!SEED_ENABLED) {
                return unauthorized(JSON.stringify({
                    success: false,
                    message: 'Unauthorized',
                    error: 'Unauthorized'
                }));
            }

            await this.dbSeeder.run();
            return  ok({
                success: true,
                message: 'Seeding completed successfully.'
            });
        } catch (error) {
            await this.dbSeeder.rollback();
            return badRequest(JSON.stringify({
                success: false,
                messale: 'Seeding failed.',
                error
            }));
        }
    }
}
