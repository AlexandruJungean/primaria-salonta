import { NextRequest, NextResponse } from 'next/server';
import { 
  logServerError, 
  extractErrorDetails, 
  determineSeverity, 
  getRequestInfo 
} from './logger';

type ApiHandler = (
  request: NextRequest, 
  context?: { params?: Record<string, string> }
) => Promise<NextResponse>;

/**
 * Wraps an API route handler with automatic error logging
 */
export function withErrorLogging(
  endpoint: string,
  method: string,
  handler: ApiHandler
): ApiHandler {
  return async (request: NextRequest, context?: { params?: Record<string, string> }) => {
    const { ipAddress, userAgent } = getRequestInfo(request);
    
    try {
      return await handler(request, context);
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      
      // Try to extract request body for POST/PATCH
      let requestBody: Record<string, unknown> | undefined;
      if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
        try {
          // Clone the request to read body
          const clonedRequest = request.clone();
          requestBody = await clonedRequest.json();
        } catch {
          // Ignore if can't parse body
        }
      }
      
      const errorDetails = extractErrorDetails(error);
      await logServerError({
        endpoint,
        method,
        errorMessage: errorDetails.message,
        errorStack: errorDetails.stack,
        errorCode: errorDetails.code,
        severity: determineSeverity(error, endpoint),
        requestBody,
        ipAddress,
        userAgent,
      });
      
      return NextResponse.json(
        { error: errorDetails.message || 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates wrapped API handlers for all methods
 */
export function createApiHandlers(endpoint: string, handlers: {
  GET?: ApiHandler;
  POST?: ApiHandler;
  PATCH?: ApiHandler;
  PUT?: ApiHandler;
  DELETE?: ApiHandler;
}) {
  const wrapped: Record<string, ApiHandler> = {};
  
  for (const [method, handler] of Object.entries(handlers)) {
    if (handler) {
      wrapped[method] = withErrorLogging(endpoint, method, handler);
    }
  }
  
  return wrapped;
}
