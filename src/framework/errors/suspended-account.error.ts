import { CustomError } from './custom-error.abstract';

export class SuspendedAccount extends CustomError {
    statusCode = 404;
    constructor(){
        super('La cuenta ha sido suspendida, por favor comuniquese con el administrador.');
        Object.setPrototypeOf(this, SuspendedAccount.prototype);
    }
    serializeErrors(){
        return [{
            message: 'Usuario desactivado, para acceder a los servicios.'
        }];
    }
}
