import AWS from 'aws-sdk';
import { Constants } from '@core/common/Constants';
import { IAWSHelper } from '@core/interfaces';

export class AWSHelper implements IAWSHelper {
    async getEnvParameters(path: string, region: string, apiVersion: string): Promise<AWS.SSM.ParameterList> {
        const ssm = new AWS.SSM({
            apiVersion: Constants.paramStoreAPIVersion,
            region,
        });
        const params = {
            Path: path,
            Recursive: true,
        };

        // eslint-disable-next-line no-useless-catch
        try {
            const promise = await ssm.getParametersByPath(params).promise();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return promise.Parameters!;
        } catch (err) {
            throw err;
        }
    }
}
