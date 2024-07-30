import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let messages: string | string[];

    if (exception instanceof HttpException) {
      messages = exception.message;
      status = exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      messages = exception.message;
      status = 500;
    } else {
      status = 500;
      messages = 'Internal server error';
    }

    Logger.error(exception);

    messages = Array.isArray(messages) ? messages : [messages];

    response.status(status).json({
      statusCode: status,
      messages,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
