import { injectable } from 'tsyringe';
import { User, UserSchema } from '@core/types/User';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Realm } from '@core/common/Constants';
import { v4 as uuidv4 } from 'uuid';
import { genSalt, hash } from 'bcryptjs';
import { IValidateUserRegisterUseCase } from '@core/interfaces';

@injectable()
export class ValidateUserRegisterUseCase implements IValidateUserRegisterUseCase {

    execute = async (event: APIGatewayProxyEvent) => {
        const user: any = JSON.parse(event.body || '{}');
        user.verified = false;
        user.created = new Date().toISOString();
        user.active = true;
        user.realm = Realm.USER;
        user.avatar = `https://ui-avatars.com/api/?background=174AAD&color=fff&size=150&name=${user.fullname}`;
        user.suscriptions = {};
        user.verification_code = uuidv4();

        const userData: User = UserSchema.parse(user);

        const salt = await genSalt(10);
        const passwordTwoHash = await hash(userData.password, salt);

        userData.password = passwordTwoHash;

        return userData;
    };
}
