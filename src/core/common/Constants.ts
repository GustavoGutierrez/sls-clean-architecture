export abstract class Constants {
    static dynamoDBAPIVersion: string = '2012-08-10';
    static paramStoreAPIVersion = '2014-11-06';
    static duration: number = 120;
    static jwtExpiresIn: string = process.env.TOKEN_EXPIRES_IN || '2h';
    static region: string = process.env.REGION || 'us-east-1';
    static path: string = `/${process.env.SSM_PARAMETER_NAME}/${process.env.STAGE}/`;
}


export enum Realm {
    ADMIN = 'admin',
    USER = 'user',
}
