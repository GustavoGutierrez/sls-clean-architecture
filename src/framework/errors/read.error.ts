/**
 * Read error custom class
 * @constructor
 * @param {!string} message Message to show
 * @param {Error} cause Error cause
 * @example
 * throw new ReadError("Validation Error", err);
 */
export class ReadError extends Error {
    cause: Error;
    statusCode: number = 400;

    constructor(message: string, cause: Error) {
        super(message);
        this.cause = cause;
        this.name = 'ReadError';
        Object.setPrototypeOf(this, ReadError.prototype);
    }
}
