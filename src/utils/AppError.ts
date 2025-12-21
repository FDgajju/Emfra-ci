import type { HttpStatusCode } from '../constants/httpStatus';
import { HTTP_STATUS } from '../constants/httpStatus';

export class AppError extends Error {
    public statusCode: HttpStatusCode;
    public isOperational: boolean;

    constructor(message: string, statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
