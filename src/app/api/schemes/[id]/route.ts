import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { HousingScheme } from '@/models/HousingScheme';
import { requireAdmin, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';

function makeSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// PUBLIC: get single scheme
export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const scheme = await HousingScheme.findById(id);
    if (!scheme) return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    return NextResponse.json(scheme);
  } catch (error) {
    console.error('GET scheme error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ADMIN: update scheme
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
    if (body.logo !== undefined)        update.logo = body.logo;
    if (body.image !== undefined)       update.image = body.image;
    if (body.areaId !== undefined)      update.areaId = body.areaId;
    if (body.areaName !== undefined)    update.areaName = body.areaName;
    if (body.description !== undefined) update.description = body.description;
    if (body.order !== undefined)       update.order = body.order;

    const scheme = await HousingScheme.findByIdAndUpdate(id, update, { new: true });
    if (!scheme) return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });

    return NextResponse.json(scheme);
  } catch (error) {
    console.error('PUT scheme error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// ADMIN: delete scheme
export const DELETE = requireAdmin(async (_req: NextRequest, _user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const scheme = await HousingScheme.findByIdAndDelete(id);
    if (!scheme) return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    return NextResponse.json({ message: 'Scheme deleted' });
  } catch (error) {
    console.error('DELETE scheme error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
