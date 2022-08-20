import { CustomError } from './custom-error.abstract';

/**
 * Custom Internal Server Error Class
 * @constructor
 * @param {string} message Message to show
 * @param {any} cause Error cause
 * @example
 * throw new InternalServerError('Error message');
 * @example
 * const err = new InternalServerError('Failed to fetch');
 *
 * // ✅ Check if instance of InternalServerError
 * if (err instanceof InternalServerError) {
 *  console.log(err.statusCode);
 *  console.log(err.message);
 *  console.log(err.getErrorMessage());
 * }
 */
export class InternalServerError extends CustomError {
    statusCode: number = 500;
    cause: any;

    constructor(message: string, cause: any) {
        super(message);
        this.name = 'InternalServerError';
        this.cause = cause;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }

    serializeErrors(): { message: string; field?: string | undefined }[] {
        return [{
            message: 'Internal server error'
        }];
    }

    getErrorMessage() {
        return 'Internal Server Error: ' + this.message;
    }
}
