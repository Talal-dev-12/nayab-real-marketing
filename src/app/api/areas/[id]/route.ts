import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Area } from '@/models/Area';
import { requireAdmin, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';

function makeSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// PUBLIC: get single area
export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const area = await Area.findById(id);
    if (!area) return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    return NextResponse.json(area);
  } catch (error) {
    console.error('GET area error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ADMIN: update area
export const PUT = requireAdmin(async (req: NextRequest, _user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const body = await req.json();

    const update: Record<string, unknown> = {};
    if (body.name !== undefined) {
      update.name = body.name.trim();
      update.slug = makeSlug(body.name);
    }
    if (body.image !== undefined)       update.image = body.image;
    if (body.description !== undefined) update.description = body.description;
    if (body.order !== undefined)       update.order = body.order;

    const area = await Area.findByIdAndUpdate(id, update, { new: true });
    if (!area) return NextResponse.json({ error: 'Area not found' }, { status: 404 });

    return NextResponse.json(area);
  } catch (error) {
    console.error('PUT area error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// ADMIN: delete area
export const DELETE = requireAdmin(async (_req: NextRequest, _user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const area = await Area.findByIdAndDelete(id);
    if (!area) return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    return NextResponse.json({ message: 'Area deleted' });
  } catch (error) {
    console.error('DELETE area error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
