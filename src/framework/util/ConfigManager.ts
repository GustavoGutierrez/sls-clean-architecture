import { inject, injectable } from 'tsyringe';
import { Constants } from '@core/common/Constants';
import { IAWSHelper, ICacheManager, IConfigManager, IEmailTemplateMapping } from '@core/interfaces';
// import { Logger } from '@aws-lambda-powertools/logger';
// const loggerCM = new Logger({ serviceName: 'ConfigManager' });
@injectable()
export class ConfigManager implements IConfigManager {
    constructor(
        @inject('IAWSHelper') private awsHelper: IAWSHelper,
        @inject('ICacheManager') private cacheManager: ICacheManager
    ) {}

    private getValueFromCache = async (key: string): Promise<string | boolean | undefined> => {
        let dict: Map<string, string>;
        dict = this.cacheManager.get('configParameters');

        if (!dict) {
            dict = await this.addConfigurationToCache();
        }
        return dict.get(key);
    };

    private addConfigurationToCache = async (): Promise<Map<string, string>> => {
        const path = Constants.path;
        const region = Constants.region;
        const duration = Constants.duration;
        const dict = new Map<string, string>();

        const parameters = await this.awsHelper.getEnvParameters(path, region, 'latest');

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < parameters.length; i++) {
            const param = parameters[i];
            if (param.Name !== undefined && param.Value != undefined)
                // Take only the variable name and not the path.
                dict.set(param.Name.split(path)[1], param.Value);
        }

        this.cacheManager.put<Map<string, string>>('configParameters', dict, duration);
        return dict;
    };

    get getSystemEmailFromParamStore(): Promise<string> {
        return (async () => {
            const value: string | undefined = await this.getValueFromCache('SYSTEM_EMAIL') as string;
            if (value !== undefined && value !== '' && value !== '{}') return value;
            else return 'no-replay@my-company.com';
        })();
    }

    get getSystemEmailNotifyFromParamStore(): Promise<string> {
        return (async () => {
            const value: string | undefined = await this.getValueFromCache('SYSTEM_EMAIL_NOTIFICATION') as string;
            if (value !== undefined && value !== '' && value !== '{}') return value;
            else return 'no-replay@my-company.com';
        })();
    }

    get getEmailTemplatesFromParamStore(): Promise<IEmailTemplateMapping | null> {
        return (async () => {
            const value = await this.getValueFromCache('EMAIL_TEMPLATES') as string;
            if (value && value !== undefined && value !== '' && value !== '{}') {
                return JSON.parse(value) as IEmailTemplateMapping;
            }
            else return null;
        })();
    }

    get getSeedEnabledFromParamStore(): Promise<boolean> {
        return (async () => {
            const value = await this.getValueFromCache('SEED_ENABLED') as boolean;
            if (value) return value;
            else return false;
        })();
    }
}
