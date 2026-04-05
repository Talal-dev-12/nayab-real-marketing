import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

// GET — current user's profile
export const GET = requireAuth(async (_req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    let profile = await User.findById(user.id).select('-password').lean();
    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: profile });
  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// PUT — update name / avatar only (not email/role)
export const PUT = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const { name, avatar } = await req.json();
    const update: Record<string, unknown> = {};
    if (name?.trim())   update.name   = name.trim();
    if (avatar?.trim()) update.avatar = avatar.trim();

    let updated = await User.findByIdAndUpdate(user.id, update, { new: true }).select('-password');
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('PUT profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

