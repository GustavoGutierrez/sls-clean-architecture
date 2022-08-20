import { IEmailTemplateMapping } from './IEmailTemplateMapping';

export interface IConfigManager {
    getSystemEmailFromParamStore: Promise<string>;
    getEmailTemplatesFromParamStore: Promise<IEmailTemplateMapping | null>;
    getSeedEnabledFromParamStore: Promise<boolean>;
    getSystemEmailNotifyFromParamStore: Promise<string>;
}
