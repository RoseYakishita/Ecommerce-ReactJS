import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = 
      exception instanceof HttpException 
        ? exception.getStatus() 
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message =
      typeof rawResponse === 'object' && rawResponse['message']
        ? rawResponse['message']
        : rawResponse;

    const code =
      typeof rawResponse === 'object' && rawResponse['error']
        ? String(rawResponse['error']).toUpperCase().replace(/\s+/g, '_')
        : status === 500
        ? 'INTERNAL_SERVER_ERROR'
        : 'REQUEST_ERROR';

    this.logger.error(`Status: ${status} Error: ${JSON.stringify(rawResponse)}`);

    response.status(status).json({
      success: false,
      statusCode: status,
      code,
      requestId: (request as any).requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      details: typeof rawResponse === 'object' ? rawResponse : undefined,
    });
  }
}
