import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'tsyringe';
import { z, ZodError } from 'zod';
import { Logger } from '@aws-lambda-powertools/logger';
import { AuthUser, User, UserSchema } from '@core/types/User';
import { ok, badRequest, created } from 'aws-lambda-utils';
import { HasRole } from '@core/decorators';
import { Realm } from '@core/common/Constants';
import { ICacheManager, IGetUserByUseCase, IJWTAuthorizer, IListUserUseCase, IRegisterUserUseCase, ISendConfirmationMailUseCase, ISendPasswordChangeUseCase, ISendPasswordResetUseCase, IUpdateUserUseCase, IValidateRegisteredUserUseCase, IValidateUserRegisterUseCase, IVerifyUserUseCase } from '@core/interfaces';


const logger = new Logger({ serviceName: 'UserController' });
@injectable()
export class UserController {
    constructor(
        @inject('IRegisterUserUseCase') private registerUserUseCase: IRegisterUserUseCase,
        @inject('ISendConfirmationMailUseCase') private sendMail: ISendConfirmationMailUseCase,
        @inject('IValidateUserRegisterUseCase') private validateUserRegisterUseCase: IValidateUserRegisterUseCase,
        @inject('IUpdateUserUseCase') private updateUserUseCase: IUpdateUserUseCase,
        @inject('IListUserUseCase') private listUserUseCase: IListUserUseCase,
        @inject('IValidateRegisteredUserUseCase') private validateRegisteredUserUseCase: IValidateRegisteredUserUseCase,
        @inject('IVerifyUserUseCase') private verifyUserUseCase: IVerifyUserUseCase,
        @inject('IGetUserByUseCase') private getUserByUseCase: IGetUserByUseCase,
        @inject('ISendPasswordResetUseCase') private sendPasswordResetUseCase: ISendPasswordResetUseCase,
        @inject('ISendPasswordChangeUseCase') private sendPasswordChangeUseCase: ISendPasswordChangeUseCase,
        @inject('ICacheManager') private cacheManager: ICacheManager,
        @inject('IJWTAuthorizer') private auth: IJWTAuthorizer,
    ) {}

    async registerUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
        if (!event.body) {
            return badRequest({
                success: false,
                message: 'No envio los datos del usuario necesarios'
            });
        }

        try {
            const userData = await this.validateUserRegisterUseCase.execute(event);

            const userExist = await this.validateRegisteredUserUseCase.execute(userData.email);

            if (userExist) {
                logger.info('User registered successfully', {userExist});
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'Ya existe un usuario registrado con este correo electrónico'
                }));
            }

            const userRegistred = await this.registerUserUseCase.execute(userData);

            if (!userRegistred) {
                logger.info('User not registered', {userRegistred});
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'Error al registrar el usuario'
                }));
            }

            await this.sendMail.execute(userData);

            return created({
                success: true,
                message: 'Usuario registrado correctamente',
                data: userData
            });

        } catch (error) {
            if (error instanceof ZodError) {
                logger.error('Error Zod Validation', {error: error.issues});
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'Error de validación de datos',
                    error: error.issues
                }));
            }

            logger.error('Error register user', {error});
            return badRequest(JSON.stringify({
                success: false,
                message: 'Error registrando usuario',
                error
            }));
        }
    }

    async verifiedUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
        try {
            const userZod = z.object({
                email: z.string().min(1).email('El correo electrónico no es válido'),
                code: z.string().min(1, 'El código de verificación no puede estar vacío'),
            });
            const userData = userZod.parse(JSON.parse(event.body || '{}'));

            const userVerified = await this.verifyUserUseCase.execute(userData.email, userData.code);

            if (!userVerified) {
                logger.info('User not exist by verified', {userVerified});
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'El usuario no existe o el código de verificación es incorrecto'
                }));
            }

            return ok({
                success: true,
                message: 'Usuario verificado correctamente'
            });

        } catch (error) {

            if (error instanceof ZodError) {
                logger.error('Error Zod Validation', {error: error.issues});
                return badRequest(JSON.stringify({
                    success: false,
                    messale: 'Los datos enviados no son válidos.',
                    error: error.issues
                }));
            }

            logger.error('Error verified user', {error});
            return badRequest(JSON.stringify({
                success: false,
                message: 'Error verificando usuario.',
                error
            }));
        }
    }

    async passwordReset(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
        try {
            const passwordResetZod = z.object({
                email: z.string().min(1).email('El correo electrónico no es válido')
            });
            const data = passwordResetZod.parse(JSON.parse(event.body || '{}'));
            const email: string = data.email;

            const user = await this.getUserByUseCase.execute(email);

            if (!user) {
                logger.info('User not exist by password reset', {user});
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'El usuario no se encuentra registrado'
                }));
            }

            await this.sendPasswordResetUseCase.execute(user);

            return ok({
                success: true,
                message: 'Se envio un link a su dirección de correo electrónico para restablecer su contraseña'
            });

        } catch (error) {

            if (error instanceof ZodError) {
                logger.error('Error Zod Validation', {error: error.issues});
                return badRequest(JSON.stringify({
                    success: false,
                    messale: 'Se requiere la dirección de correo electrónico para restablecer su contraseña',
                    error: error.issues
                }));
            }

            logger.error('Error reset password by user', {error});
            return badRequest(JSON.stringify({
                success: false,
                message: 'Error en el proceso de restablecimiento de contraseña, por favor intente nuevamente.',
                error
            }));
        }
    }

    async passwordChange(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
        try {
            const passwordChangeZod = z.object({
                email: z.string().min(1).email('El correo electrónico no es válido'),
                code: z.string().min(1, 'El código de confirmación no puede estar vacío'),
                newPassword: z.string().min(1).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un caracter especial'),
            });

            const data = passwordChangeZod.parse(JSON.parse(event.body || '{}'));
            const email: string = data.email;

            const user = await this.getUserByUseCase.execute(email);

            if (!user) {
                logger.info('User not exist by password change', {user});
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'No se puede restablecer la contraseña, el usuario no se encuentra registrado'
                }));
            }

            if (user.verification_code!==data.code) {
                logger.info('User not exist by password change', {user});
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'El código de confirmación es incorrecto'
                }));
            }

            await this.sendPasswordChangeUseCase.execute(user, data.newPassword);

            const token = await this.auth.tokenize(user);

            return ok({
                success: true,
                status: 'OK',
                message: 'Se restablecio la contraseña correctamente',
                token,
                user: {...user, password: undefined, verification_code: '', created: undefined, suscriptions: undefined}
            });

        } catch (error) {

            if (error instanceof ZodError) {
                logger.error('Error Zod Validation', {error: error.issues});
                return badRequest(JSON.stringify({
                    success: false,
                    messale: 'Se requiere la dirección de correo electrónico para restablecer su contraseña',
                    error: error.issues
                }));
            }

            logger.error('Error reset password by user', {error});
            return badRequest(JSON.stringify({
                success: false,
                message: 'Error en el proceso de restablecimiento de contraseña, por favor intente nuevamente.',
                error
            }));
        }
    }

    @HasRole([Realm.ADMIN, Realm.USER])
    async setAPassword(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
        try {

            const authUser = this.cacheManager.get('authUser') as AuthUser;

            logger.info('listUser - Auth user:', {authUser});

            const passwordChangeZod = z.object({
                newPassword: z.string().min(1).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un caracter especial'),
            });

            const data = passwordChangeZod.parse(JSON.parse(event.body || '{}'));
            const email: string = authUser.email;

            const user = await this.getUserByUseCase.execute(email);

            if (!user) {
                logger.info('User not exist by password change', {user});
                return badRequest(JSON.stringify({
                    success: false,
                    message: 'No se puede restablecer la contraseña, el usuario no se existe.'
                }));
            }

            await this.sendPasswordChangeUseCase.execute(user, data.newPassword);

            return ok({
                success: true,
                status: 'OK',
                message: 'Nueva contraseña establecida'
            });

        } catch (error) {


            if (error instanceof ZodError) {
                logger.error('Error Zod Validation', {error: error.issues});
                return badRequest(JSON.stringify({
                    success: false,
                    messale: 'Se requiere la dirección de correo electrónico para restablecer su contraseña',
                    error: error.issues
                }));
            }

            logger.error('Error reset password by user', {error});
            return badRequest(JSON.stringify({
                success: false,
                message: 'Error en el proceso de establecimiento de una nueva contraseña, por favor intente nuevamente.',
                error
            }));
        }
    }

    @HasRole([Realm.ADMIN])
    async listUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            const authUser = this.cacheManager.get('authUser');

            logger.info('listUser - Auth user:', {authUser});

            const users = await this.listUserUseCase.execute();
            const response: APIGatewayProxyResult = ok({
                success: true,
                message: 'User list successfully',
                data: users.Items
            });
            return response;
        } catch (error) {
            logger.error('Error List Users', {error});
            return badRequest('Error listando usuarios');
        }
    }

    @HasRole([Realm.ADMIN])
    async updateUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        if (!event.body) {
            return badRequest('No data provided');
        }

        const user: User = UserSchema.parse(JSON.parse(event.body));
        await this.updateUserUseCase.execute(user);
        const response: APIGatewayProxyResult = ok({
            success: true,
            message: 'User updated successfully',
        });

        return response;
    }
}
