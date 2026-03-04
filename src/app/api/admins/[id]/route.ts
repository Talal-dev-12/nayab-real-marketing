import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { requireSuperAdmin, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

export const PUT = requireSuperAdmin(async (req: NextRequest, _user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const body = await req.json();
    delete body.password; // use a dedicated change-password endpoint instead
    const admin = await AdminUser.findByIdAndUpdate(id, body, { new: true }).select('-password');
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    return NextResponse.json(admin);
  } catch (error) {
    console.error('PUT admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = requireSuperAdmin(async (_req: NextRequest, user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }
    const admin = await AdminUser.findByIdAndDelete(id);
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
