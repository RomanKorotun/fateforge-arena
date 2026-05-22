// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   Injectable,
//   Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch()
// @Injectable()
// export class AllExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionFilter.name);

//   catch(exception: unknown, host: ArgumentsHost) {

//     const status: number =
//       exception instanceof HttpException ? exception.getStatus() : 500;

//     let message: string | object = 'Server error';

//     const request = host.switchToHttp().getRequest<Request>();

//     const response = host.switchToHttp().getResponse<Response>();

//     const url = request.url;

//     if (exception instanceof HttpException) {
//       const responseError = exception.getResponse() as
//         | Record<string, string | string[]>
//         | string;
//       if (
//         typeof responseError === 'object' &&
//         responseError !== null &&
//         'message' in responseError
//       ) {
//         message = responseError.message;
//       } else if (typeof responseError === 'string') {
//         message = responseError;
//       }
//     }

//     if (process.env.NODE_ENV === 'development') {
//       this.logger.error(message, exception);
//     }

//     response.status(status).json({
//       status,
//       message,
//       url,
//       timestamp: new Date().toISOString(),
//     });
//   }
// }

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../../shared/domain/errors/domain-error';

@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    const url = request.url;

    let status = 500;
    let message: string | object = 'Server error';

    // 1. DOMAIN ERROR
    if (exception instanceof DomainError) {
      status = exception.httpCode;
      message = exception.message;
    }

    // NEST HTTP ERROR
    else if (exception instanceof HttpException) {
      status = exception.getStatus();

      const responseError = exception.getResponse() as
        | Record<string, string | string[]>
        | string;

      if (
        typeof responseError === 'object' &&
        responseError !== null &&
        'message' in responseError
      ) {
        message = responseError.message;
      } else if (typeof responseError === 'string') {
        message = responseError;
      }
    }

    this.logger.error(
      `URL: ${url} | TYPE: ${exception?.constructor?.name || 'unknown'} | MESSAGE: ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      status,
      message,
      url,
      timestamp: new Date().toISOString(),
    });
  }
}
