import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContactMessage } from '@/models/ContactMessage';
import { requireAuth, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';

export const PUT = requireAuth(async (req: NextRequest, _user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const body = await req.json();
    const message = await ContactMessage.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    return NextResponse.json(message);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = requireAuth(async (_req: NextRequest, _user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const message = await ContactMessage.findByIdAndDelete(id);
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
