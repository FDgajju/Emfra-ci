import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { env } from '../constants/env';

export function errorHandler(
    error: FastifyError | AppError,
    _request: FastifyRequest,
    reply: FastifyReply,
) {
    // Handle operational errors (AppError)
    if (error instanceof AppError && error.isOperational) {
        return reply.status(error.statusCode).send({
            success: false,
            message: error.message,
            ...(env.nodeEnv === 'development' && { stack: error.stack }),
        });
    }

    // Handle Fastify validation errors
    if ('validation' in error && error.validation) {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({
            success: false,
            message: 'Validation error',
            errors: error.validation,
        });
    }

    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: env.nodeEnv === 'development' ? error.message : 'Internal server error',
        ...(env.nodeEnv === 'development' && { stack: error.stack }),
    });
}
