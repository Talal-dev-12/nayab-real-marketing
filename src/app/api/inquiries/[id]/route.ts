import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Inquiry } from '@/models/Inquiry';
import { requireAuth, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';

// PUT — admin marks as read
export const PUT = requireAuth(async (req: NextRequest, user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    if (!['admin', 'superadmin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const updated = await Inquiry.findByIdAndUpdate(id, { read: body.read }, { returnDocument: "after" });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// DELETE — admin only
export const DELETE = requireAuth(async (_req: NextRequest, user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    if (!['admin', 'superadmin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
