import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { requireAuth, requireSuperAdmin, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

export const GET = requireAuth(async (_req: NextRequest, _user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const admins = await AdminUser.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(admins);
  } catch (error) {
    console.error('GET admins error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = requireSuperAdmin(async (req: NextRequest, _user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, role } = body;
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }
    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Admin with this email already exists' }, { status: 409 });
    }
    const admin = await AdminUser.create({ name, email, password: password || undefined, role: role || 'admin' });
    const { password: _, ...adminData } = admin.toObject();
    return NextResponse.json(adminData, { status: 201 });
  } catch (error) {
    console.error('POST admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
