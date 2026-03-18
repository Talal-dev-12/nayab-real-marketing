import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JwtPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest { user?: JwtPayload; }
export type RouteContext = { params: Promise<Record<string, string>> };

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  // Accept new unified cookie OR legacy cookie — whichever is present
  return (
    req.cookies.get('auth_token')?.value ??
    req.cookies.get('admin_token')?.value ??
    null
  );
}

// Any authenticated role
export function requireAuth(
  handler: (req: NextRequest, user: JwtPayload, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
      const user = verifyToken(token);
      return handler(req, user, ctx);
    } catch {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }
  };
}

// Admin or superadmin only
export function requireAdmin(
  handler: (req: NextRequest, user: JwtPayload, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
      const user = verifyToken(token);
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return handler(req, user, ctx);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}

// Superadmin only
export function requireSuperAdmin(
  handler: (req: NextRequest, user: JwtPayload, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
      const user = verifyToken(token);
      if (user.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 });
      }
      return handler(req, user, ctx);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}

// Agent or admin/superadmin
export function requireAgentOrAdmin(
  handler: (req: NextRequest, user: JwtPayload, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
      const user = verifyToken(token);
      if (!['agent', 'admin', 'superadmin'].includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return handler(req, user, ctx);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}

// Writer or admin/superadmin
export function requireWriterOrAdmin(
  handler: (req: NextRequest, user: JwtPayload, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
      const user = verifyToken(token);
      if (!['writer', 'admin', 'superadmin'].includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return handler(req, user, ctx);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}
