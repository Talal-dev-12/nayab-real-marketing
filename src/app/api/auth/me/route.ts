import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

export const GET = requireAuth(async (_req: NextRequest, jwtUser: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();

    const dbUser = await User.findById(jwtUser.id).select('-password');
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error('Me route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

