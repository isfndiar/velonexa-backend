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
    default:
      return 'INTERNAL SERVER ERROR';
  }
}
