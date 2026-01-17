import { createClient } from '@supabase/supabase-js';

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'upload' | 'view';

export type ResourceType = 
  | 'news'
  | 'event'
  | 'document'
  | 'declaration'
  | 'petition'
  | 'contact'
  | 'gallery'
  | 'institution'
  | 'council_session'
  | 'council_decision'
  | 'job_vacancy'
  | 'program'
  | 'program_document'
  | 'program_image'
  | 'program_update'
  | 'webcam'
  | 'office_hours'
  | 'staff'
  | 'council_member'
  | 'user'
  | 'settings'
  | 'report'
  | 'faq';

export interface AuditLogEntry {
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  resourceTitle?: string;
  details?: Record<string, unknown>;
  userId?: string;
  userEmail?: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit entry to the database
 */
export async function logAuditAction(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = createAdminClient();

    await supabase.from('audit_logs').insert([{
      user_id: entry.userId || null,
      user_email: entry.userEmail || null,
      user_name: entry.userName || null,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId || null,
      resource_title: entry.resourceTitle || null,
      details: entry.details || null,
      ip_address: entry.ipAddress || null,
      user_agent: entry.userAgent || null,
    }]);
  } catch (error) {
    // Don't throw - logging should not break the main operation
    console.error('Failed to log audit action:', error);
  }
}

/**
 * Helper to extract IP and User-Agent from request headers
 */
export function getRequestInfo(request: Request): { ipAddress: string; userAgent: string } {
  const forwarded = request.headers.get('x-forwarded-for');
  const ipAddress = forwarded?.split(',')[0]?.trim() || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
}

/**
 * Get action label in Romanian for display
 */
export function getActionLabel(action: AuditAction): string {
  const labels: Record<AuditAction, string> = {
    create: 'Creare',
    update: 'Modificare',
    delete: 'Ștergere',
    login: 'Autentificare',
    logout: 'Deconectare',
    upload: 'Încărcare',
    view: 'Vizualizare',
  };
  return labels[action] || action;
}

/**
 * Get resource type label in Romanian for display
 */
export function getResourceTypeLabel(resourceType: ResourceType): string {
  const labels: Record<ResourceType, string> = {
    news: 'Știre',
    event: 'Eveniment',
    document: 'Document',
    declaration: 'Declarație',
    petition: 'Petiție',
    contact: 'Mesaj contact',
    gallery: 'Galerie',
    institution: 'Instituție',
    council_session: 'Ședință CL',
    council_decision: 'Hotărâre CL',
    job_vacancy: 'Concurs',
    program: 'Program',
    program_document: 'Document program',
    program_image: 'Imagine program',
    program_update: 'Actualizare program',
    webcam: 'Cameră web',
    office_hours: 'Program lucru',
    staff: 'Personal',
    council_member: 'Consilier',
    user: 'Utilizator',
    settings: 'Setări',
    report: 'Raport',
    faq: 'Întrebare frecventă',
  };
  return labels[resourceType] || resourceType;
}

// ============================================
// ERROR LOGGING
// ============================================

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorLogEntry {
  endpoint: string;
  method: string;
  errorMessage: string;
  errorStack?: string;
  errorCode?: string;
  severity?: ErrorSeverity;
  requestBody?: Record<string, unknown>;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log a server error to the database
 */
export async function logServerError(entry: ErrorLogEntry): Promise<void> {
  try {
    const supabase = createAdminClient();

    // Sanitize request body - remove sensitive fields
    let sanitizedBody = entry.requestBody;
    if (sanitizedBody) {
      const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
      sanitizedBody = Object.fromEntries(
        Object.entries(sanitizedBody).filter(
          ([key]) => !sensitiveFields.some(sf => key.toLowerCase().includes(sf))
        )
      );
    }

    await supabase.from('error_logs').insert([{
      endpoint: entry.endpoint,
      method: entry.method,
      error_message: entry.errorMessage,
      error_stack: entry.errorStack || null,
      error_code: entry.errorCode || null,
      severity: entry.severity || 'medium',
      request_body: sanitizedBody || null,
      user_id: entry.userId || null,
      ip_address: entry.ipAddress || null,
      user_agent: entry.userAgent || null,
    }]);
  } catch (logError) {
    // Don't throw - logging should not break the main operation
    console.error('Failed to log server error:', logError);
  }
}

/**
 * Helper to extract error details from an unknown error
 */
export function extractErrorDetails(error: unknown): { message: string; stack?: string; code?: string } {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      code: (error as Error & { code?: string }).code,
    };
  }
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    return {
      message: String(errorObj.message || errorObj.error || JSON.stringify(error)),
      code: String(errorObj.code || ''),
    };
  }
  
  return { message: 'Unknown error' };
}

/**
 * Determine error severity based on error type
 */
export function determineSeverity(error: unknown, endpoint: string): ErrorSeverity {
  const errorDetails = extractErrorDetails(error);
  const message = errorDetails.message.toLowerCase();
  
  // Critical - security or auth issues
  if (message.includes('unauthorized') || 
      message.includes('forbidden') || 
      message.includes('injection') ||
      endpoint.includes('/auth/')) {
    return 'critical';
  }
  
  // High - database or infrastructure issues
  if (message.includes('database') || 
      message.includes('connection') || 
      message.includes('timeout') ||
      message.includes('supabase')) {
    return 'high';
  }
  
  // Low - validation or user input issues
  if (message.includes('validation') || 
      message.includes('invalid') || 
      message.includes('required') ||
      message.includes('not found')) {
    return 'low';
  }
  
  return 'medium';
}
