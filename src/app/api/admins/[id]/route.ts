import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { requireAdmin, requireSuperAdmin, RouteContext, getTokenFromRequest } from '@/lib/auth-middleware';
import { verifyToken, JwtPayload } from '@/lib/jwt';

// PUT — superadmin: any; admin: only agents & writers
export async function PUT(req: NextRequest, ctx: RouteContext) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let user: JwtPayload;
  try { user = verifyToken(token); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  if (user.role !== 'admin' && user.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await connectDB();
    const { id } = await ctx.params;
    const target = await AdminUser.findById(id);
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Admin cannot modify admin or superadmin accounts
    if (user.role === 'admin' && (target.role === 'admin' || target.role === 'superadmin')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    delete body.password;
    const updated = await AdminUser.findByIdAndUpdate(id, body, { new: true }).select('-password');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — superadmin: any (not self, not other superadmin); admin: only agents & writers
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let user: JwtPayload;
  try { user = verifyToken(token); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  if (user.role !== 'admin' && user.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await connectDB();
    const { id } = await ctx.params;
    if (id === user.id) return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });

    const target = await AdminUser.findById(id);
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Admin cannot delete admin or superadmin accounts
    if (user.role === 'admin' && (target.role === 'admin' || target.role === 'superadmin')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    // Superadmin cannot delete other superadmins
    if (user.role === 'superadmin' && target.role === 'superadmin') {
      return NextResponse.json({ error: 'Cannot remove another super admin' }, { status: 403 });
    }

    await AdminUser.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
