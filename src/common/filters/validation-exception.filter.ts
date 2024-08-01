import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();
    const validatorException = exception.getResponse() as any;
    let message: string;

    if (validatorException.type == 'classValidator') {
      const { constraints } = validatorException;
      const constraintMessages = Object.values(constraints)[0] as string;

      message = constraintMessages;
    }

    res.status(400).json({
      success: false,
      error: {
        code: 400,
        status: 'BAD REQUEST',
        message: message,
      },
    });
  }
}
