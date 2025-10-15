// utils/response.ts
export class APIResponse {
  static success(data: any, message?: string) {
    return Response.json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static error(message: string, code: string = 'VALIDATION_ERROR', status: number = 400) {
    return Response.json({
      success: false,
      error: {
        code,
        message
      },
      timestamp: new Date().toISOString()
    }, { status });
  }

  static rateLimited(resetTime: number) {
    return Response.json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests'
      },
      retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
      timestamp: new Date().toISOString()
    }, { status: 429 });
  }
}