import { Catch, ArgumentsHost, HttpException, HttpStatus, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : (exception as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;

        const res = exception instanceof HttpException ? exception.getResponse() : null;
        let detail = 'Une erreur interne inattendue est survenue.';

        if (typeof res === 'object' && res !== null) {
            const msg = (res as any).message;
            detail = Array.isArray(msg) ? msg.join('; ') : msg || (exception as Error).message;
        } else if (exception instanceof Error) {
            detail = exception.message;
        }

        const title = HttpStatus[status] ? HttpStatus[status].toString().replace(/_/g, ' ') : 'Error';

        response
            .status(status)
            .setHeader('Content-Type', 'application/problem+json')
            .json({
                type: status === 500 ? 'https://tools.ietf.org/html/rfc7231#section-6.6.1' : 'about:blank',
                title,
                status,
                detail,
                instance: request.url,
            }
        );
    }
}