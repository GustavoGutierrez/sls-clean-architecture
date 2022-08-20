import { inject, injectable } from 'tsyringe';
import { IGetUserByUseCase, IJWTAuthorizer, IRefreshTokenUseCase } from '@core/interfaces';
import { UnverifiedUserError } from '@framework/errors';
import { SuspendedAccount } from '@framework/errors/suspended-account.error';

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject('IJWTAuthorizer') private auth: IJWTAuthorizer,
        @inject('IGetUserByUseCase') private getUserByUseCase: IGetUserByUseCase
    ) {}

    execute = async (token: string): Promise<any | boolean> => {
        const auth = await this.auth.refreshAuthorize(token);

        if (!auth) {
            return false;
        }

        if (auth.exp && (auth.exp * 1000) < Date.now()) {
            return false;
        }

        const user = await this.getUserByUseCase.execute(auth.email);

        if (!user) {
            return false;
        }

        if (user && Object.keys(user).length === 0) {
            return false;
        }

        if (user && !user.verified) {
            throw new UnverifiedUserError();
        }

        if (user && !user.active) {
            throw new SuspendedAccount();
        }

        return {...user, verification_code: undefined, password: undefined, created: undefined, suscriptions: undefined};

    };
}
