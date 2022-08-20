import 'reflect-metadata';
import { container } from 'tsyringe';
import { AWSHelper } from './AWSHelper';
import { CacheManager } from './CacheManager';
import { ConfigManager } from './ConfigManager';
import { DBHelper } from './DBHelper';
import { JWTAuthorizer } from './JWTAuthorizer';
import { DatabaseSeeder, UserSeeder } from '@core/database/seeders';
import * as fromRepositories from '@framework/repositories';
import * as fromControllers from '@app/controllers';
import { ValidateRegisteredUserUseCase, ValidateUserRegisterUseCase, VerifyUserUseCase } from '@app/use_cases/validation';
import { GetUserByUseCase, ListUserUseCase, LoginUserUseCase, RegisterUserUseCase, UpdateUserUseCase } from '@app/use_cases/user';
import { SendConfirmationMailUseCase, SendEmailNotificationUseCase, SendPasswordChangeUseCase, SendPasswordResetUseCase } from '@app/use_cases/send-email';
import { RefreshTokenUseCase } from '@app/use_cases/user/refresh-token.use-case';

// Utils
container.registerSingleton('ICacheManager', CacheManager);
container.registerSingleton('IJWTAuthorizer', JWTAuthorizer);
container.registerSingleton('IConfigManager', ConfigManager);
container.registerSingleton('IAWSHelper', AWSHelper);
container.registerSingleton('IDBHelper', DBHelper);

// Repositories
container.register('IUserRepository', fromRepositories.UserRepository);
container.register('IAuthRepository', fromRepositories.AuthRepository);
container.register('ISendEmailRepository', fromRepositories.SendEmailRepository);

// Use cases
container.register('IVerifyUserUseCase', VerifyUserUseCase);
container.register('IValidateRegisteredUserUseCase', ValidateRegisteredUserUseCase);
container.register('IRegisterUserUseCase', RegisterUserUseCase);
container.register('IValidateUserRegisterUseCase', ValidateUserRegisterUseCase);
container.register('IUpdateUserUseCase', UpdateUserUseCase);
container.register('IListUserUseCase', ListUserUseCase);
container.register('ILoginUserUseCase', LoginUserUseCase);
container.register('ISendConfirmationMailUseCase', SendConfirmationMailUseCase);
container.register('ISendPasswordResetUseCase', SendPasswordResetUseCase);
container.register('IGetUserByUseCase', GetUserByUseCase);
container.register('ISendPasswordChangeUseCase', SendPasswordChangeUseCase);
container.register('IRefreshTokenUseCase', RefreshTokenUseCase);
container.register('ISendEmailNotificationUseCase', SendEmailNotificationUseCase);

// Seeders
container.register('UserSeeder', UserSeeder);
container.register('IDBSeeder', DatabaseSeeder);

// Controllers
container.register('SeedController', fromControllers.SeedController);
container.register('UserController', fromControllers.UserController);
container.register('AuthController', fromControllers.AuthController);

export const diContainer = container;
