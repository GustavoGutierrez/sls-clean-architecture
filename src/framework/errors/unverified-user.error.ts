import { CustomError } from './custom-error.abstract';

export class UnverifiedUserError extends CustomError {
    statusCode = 404;
    constructor(){
        super('Cuenta de usuario no verificada.');
        Object.setPrototypeOf(this, UnverifiedUserError.prototype);
    }
    serializeErrors(){
        return [{
            message: 'Correo electrónico no verificado.'
        }];
    }
}
