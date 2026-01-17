import { NextRequest, NextResponse } from 'next/server';
import { logAuditAction, getRequestInfo, AuditAction } from '@/lib/audit/logger';

// POST - Log authentication events (login/logout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, userEmail, userName } = body;
    const { ipAddress, userAgent } = getRequestInfo(request);

    if (!action || (action !== 'login' && action !== 'logout')) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "login" or "logout"' },
        { status: 400 }
      );
    }

    await logAuditAction({
      action: action as AuditAction,
      resourceType: 'user',
      resourceId: userId,
      resourceTitle: userName || userEmail,
      details: { email: userEmail },
      userId,
      userEmail,
      userName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging auth action:', error);
    return NextResponse.json(
      { error: 'Failed to log action' },
      { status: 500 }
    );
  }
}
