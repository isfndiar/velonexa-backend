export class WebResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: WebError;
}

class WebError {
  code: number;
  status: string;
  message: string;
}
