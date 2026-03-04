import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JwtPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JwtPayload;
}

// Next.js route context type
export type RouteContext = { params: Promise<Record<string, string>> };

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  // Fallback to cookie
  const cookie = req.cookies.get('admin_token');
  return cookie?.value ?? null;
}

export function requireAuth(
  handler: (req: NextRequest, user: JwtPayload, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    try {
      const user = verifyToken(token);
      return handler(req, user, ctx);
    } catch {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }
  };
}

export function requireSuperAdmin(
  handler: (req: NextRequest, user: JwtPayload, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const user = verifyToken(token);
      if (user.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden - Super admin access required' }, { status: 403 });
      }
      return handler(req, user, ctx);
    } catch {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }
  };
}
