import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload, UserRole } from '@/lib/jwt';

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const property = await Property.findById(id);
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    return NextResponse.json(property);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const PUT = requireAuth(async (req: NextRequest, user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const property = await Property.findById(id);
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    // Agents can only edit their own properties
    const role = user.role as UserRole;
    if (role === 'agent' && property.agentId !== user.id) {
      return NextResponse.json({ error: 'Forbidden - not your property' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await Property.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT property error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = requireAuth(async (_req: NextRequest, user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const property = await Property.findById(id);
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    // Agents can only delete their own properties
    const role = user.role as UserRole;
    if (role === 'agent' && property.agentId !== user.id) {
      return NextResponse.json({ error: 'Forbidden - not your property' }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});