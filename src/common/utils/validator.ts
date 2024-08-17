import { HttpException } from '@nestjs/common';

export function statusException(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'BAD REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT FOUND';
    case 409:
      return 'CONFLICT';
    case 413:
      return 'CONTENT TOO LARGE';
    default:
      return 'INTERNAL SERVER ERROR';
  }
}

export function validateTags(tags?: string[]) {
  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      if (typeof tag !== 'string' || tag.length < 6 || tag.length > 20) {
        throw new HttpException(
          'Each tag must be a string with length between 6 and 20 characters.',
          404,
        );
      }
    });
  }
}
