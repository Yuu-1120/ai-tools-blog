export interface ApiResponse<T> {
  code: number;
  data: T | null;
  message: string;
}

export function successResponse<T>(data: T, message = 'success'): ApiResponse<T> {
  return {
    code: 200,
    data,
    message
  };
}

export function errorResponse(message: string, code = 500): ApiResponse<null> {
  return {
    code,
    data: null,
    message
  };
}
