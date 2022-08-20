interface IEmailTpl {
    TemplateName: string;
    Params: string[];
}

export interface IEmailTemplateMapping {
    [key: string]: IEmailTpl;
    ConfirmEmail: IEmailTpl;
    ResetEmail: IEmailTpl;
    PasswordChange: IEmailTpl;
    Notification: IEmailTpl;
}
