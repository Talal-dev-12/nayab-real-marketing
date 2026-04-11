import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { requireAuth, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';
import { can } from '@/lib/rbac';

export const PUT = requireAuth(async (req: NextRequest, jwtUser: JwtPayload, ctx: RouteContext) => {
  try {
    if (!can(jwtUser.role, 'manageUsers')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const params = await ctx.params;
    const targetUserId = params!.id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Only superadmin can modify superadmins
    if (targetUser.role === 'superadmin' && jwtUser.role !== 'superadmin') {
      return NextResponse.json({ error: 'Cannot modify superadmin' }, { status: 403 });
    }

    const updates = await req.json();
    
    // Prevent role escalation to superadmin by non-superadmin
    if (updates.role === 'superadmin' && jwtUser.role !== 'superadmin') {
      delete updates.role;
    }

    const updated = await User.findByIdAndUpdate(targetUserId, updates, { returnDocument: "after" }).select('-password');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = requireAuth(async (_req: NextRequest, jwtUser: JwtPayload, ctx: RouteContext) => {
  try {
    if (!can(jwtUser.role, 'manageUsers')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const params = await ctx.params;
    const targetUserId = params!.id;

    if (jwtUser.id === targetUserId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Only superadmin can delete superadmins
    if (targetUser.role === 'superadmin' && jwtUser.role !== 'superadmin') {
      return NextResponse.json({ error: 'Cannot delete superadmin' }, { status: 403 });
    }

    await User.findByIdAndDelete(targetUserId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
