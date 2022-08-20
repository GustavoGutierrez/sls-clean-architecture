export interface IEmailNotifyConfig {
    to: string;
    body: string;
    subject?: string;
    footer?: string;
}

export interface ISendEmailNotificationUseCase {
    execute(config: IEmailNotifyConfig): Promise<void>;
}
