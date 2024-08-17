import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { statusException } from '../utils/validator';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();

    console.log(exception);
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    const status = statusException(statusCode);
    if (statusCode == 413) {
      message = 'file size too large maximum 5mb';
    }

    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode,
        status: status,
        message: message,
      },
    });
  }
}
