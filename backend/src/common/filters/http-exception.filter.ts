import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

// Centralized error handler — never leaks stack traces or internal details to the client.
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    // Log full error server-side but never send it to client
    if (status >= 500) {
      this.logger.error(`${req.method} ${req.url} — ${JSON.stringify(exception)}`);
    }

    res.status(status).json({
      statusCode: status,
      message: typeof message === 'string'
        ? message
        : (message as any).message || 'An error occurred',
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
