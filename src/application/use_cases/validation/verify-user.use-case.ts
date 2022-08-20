import { inject, injectable } from 'tsyringe';
import { User } from '@core/types/User';
import { IUserRepository, IVerifyUserUseCase } from '@core/interfaces';

@injectable()
export class VerifyUserUseCase implements IVerifyUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository
    ) {}

    execute = async (email: string, code: string) => {
        const userExist = await this.userRepo.findOneUser(email);
        if (userExist.Item) {
            const user: User = userExist.Item as User;
            const isVerified = user.verified;
            if (!isVerified) {
                const isValidCode = user.verification_code === code;
                if (isValidCode) {
                    await this.userRepo.updateVerifyUser({ email, verified: true });
                    return true;
                }
            }
        }
        return false;
    };
}
