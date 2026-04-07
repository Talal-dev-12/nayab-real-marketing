import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import { requireAuth, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';
import { can } from '@/lib/rbac';

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

    // Ownership check: sellers can only edit their own submissions
    if (user.role === 'seller' && property.submittedBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden – not your listing' }, { status: 403 });
    }
    // Agents can only edit properties assigned to them
    if (user.role === 'agent' && property.agentId !== user.id) {
      return NextResponse.json({ error: 'Forbidden – not your property' }, { status: 403 });
    }

    const body = await req.json();

    // Sellers cannot change featured status, agentId, or approvalStatus
    if (user.role === 'seller') {
      delete body.featured;
      delete body.agentId;
      delete body.approvalStatus;
      delete body.rejectionNote;
    }

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

    // Only admins/superadmin can delete any property
    // Sellers cannot delete — they should contact admin
    if (!can(user.role, 'deleteAnyProperty')) {
      return NextResponse.json({ error: 'Forbidden – only admins can delete listings' }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
