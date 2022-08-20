import { IRegisterUserUseCase } from '@core/interfaces';
import { User } from '@core/types/User';
import { diContainer } from '@framework/util/DIRegister';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'UseCaseTest' });

describe('RegisterUserUseCase', () => {

    test('register user', async () => {
        const user: User = {
            fullname: 'pratik',
            email: 'abcd@gmail.com',
            phone: '3114345423',
            password: '123456',
            realm: 'user',
            verified: false,
            active: true,
            created: new Date().toISOString()
        };

        const registerUserUseCase: IRegisterUserUseCase = diContainer.resolve('IRegisterUserUseCase');

        const userRegistred = await registerUserUseCase.execute(user);

        logger.info('userRegistred', {userRegistred});

        expect(userRegistred).toBeDefined();
    });

});
