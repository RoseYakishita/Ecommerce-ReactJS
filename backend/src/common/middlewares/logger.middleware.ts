import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = request.headers['x-request-id']?.toString() || randomUUID();
    (request as any).requestId = requestId;
    response.setHeader('x-request-id', requestId);

    const { ip, method, baseUrl, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const url = originalUrl || baseUrl;
    const startedAt = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || '0';
      const duration = Date.now() - startedAt;

      this.logger.log(
        `[${requestId}] ${method} ${url} ${statusCode} ${contentLength}b ${duration}ms - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
