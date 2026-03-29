import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { requireAdmin, requireSuperAdmin, RouteContext, getTokenFromRequest } from '@/lib/auth-middleware';
import { verifyToken, JwtPayload } from '@/lib/jwt';

// GET — superadmin sees all, admin sees only agents & writers
export const GET = requireAdmin(async (_req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const filter = user.role === 'superadmin'
      ? {}
      : { role: { $in: ['agent', 'writer', 'seller'] } };
    const admins = await AdminUser.find(filter).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(admins);
  } catch (error) {
    console.error('GET admins error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST — superadmin: any role; admin: only agent or writer
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let user: JwtPayload;
  try { user = verifyToken(token); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  if (user.role !== 'admin' && user.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, role } = body;
    if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });

    // Admin cannot create admin or superadmin accounts
    if (user.role === 'admin' && (role === 'admin' || role === 'superadmin')) {
      return NextResponse.json({ error: 'Admins can only create agent, writer, or seller accounts' }, { status: 403 });
    }

    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });

    const admin = await AdminUser.create({ name, email, password: password || undefined, role: role || 'admin' });
    const { password: _, ...adminData } = admin.toObject();
    return NextResponse.json(adminData, { status: 201 });
  } catch (error) {
    console.error('POST admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
