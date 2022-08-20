import { inject, injectable } from 'tsyringe';
import { User } from '@core/types/User';
import { compare } from 'bcryptjs';
import { UnverifiedUserError } from '@framework/errors';
import { SuspendedAccount } from '@framework/errors/suspended-account.error';
import { IDBHelper } from '@core/interfaces';
// import { Logger } from '@aws-lambda-powertools/logger';
// const logger = new Logger({ serviceName: 'UserRepository' });

const tableNameUser: string = process.env.USER_TABLE || 'user';
@injectable()
export class AuthRepository {

    constructor(@inject('IDBHelper') private dbHelper: IDBHelper) {}

    auth = async (email: string, password: string): Promise<Partial<User> | boolean> => {
        const result = await this.dbHelper.findByEmail(tableNameUser, email, 'fullname, password, email, phone, avatar, verified, active, realm');
        if (result.Items) {
            const user = result.Items[0] as User;
            if (!user.verified) {
                throw new UnverifiedUserError();
            }

            if (!user.active) {
                throw new SuspendedAccount();
            }

            if (user) {
                if (await compare(password, user.password)) {
                    return {...user, password: undefined};
                }
            }
        }

        return false;
    };

}
