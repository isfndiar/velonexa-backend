import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();
    const req = http.getRequest<Request>();
    const validatorException = exception.getResponse() as any;
    let message: string;

    if (validatorException.type == 'classValidator') {
      const { constraints } = validatorException;
      const constraintMessages = Object.values(constraints)[0] as string;

      message = constraintMessages;
    } else if (
      exception.message.includes('Too many files') &&
      req.url == '/api/v1/media?type=posts'
    ) {
      message = 'Too many files uploaded. Maximum 10 file';
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
