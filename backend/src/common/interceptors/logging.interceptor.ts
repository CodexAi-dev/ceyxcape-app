import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

// Logs every request with method, path, duration, and status.
// Flags suspiciously long requests (>5s) for investigation.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip } = req;
    const userAgent = req.headers['user-agent'] || '-';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          const res = context.switchToHttp().getResponse();
          this.logger.log(`${method} ${url} ${res.statusCode} ${ms}ms — ${ip} "${userAgent}"`);
          if (ms > 5000) this.logger.warn(`SLOW REQUEST: ${method} ${url} took ${ms}ms`);
        },
        error: (err) => {
          const ms = Date.now() - start;
          this.logger.warn(`${method} ${url} ERROR ${err.status || 500} ${ms}ms — ${ip}`);
        },
      }),
    );
  }
}
