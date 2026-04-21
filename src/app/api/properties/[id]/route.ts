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

    const prevStatus = property.approvalStatus;
    const updated = await Property.findByIdAndUpdate(id, body, { returnDocument: "after", runValidators: true });

    if (updated.approvalStatus !== prevStatus) {
      if (updated.approvalStatus === 'approved' || updated.approvalStatus === 'rejected') {
        const { User } = await import('@/models/User');
        const seller = await User.findById(property.submittedBy);
        if (seller) {
          const { sendPropertyApprovedEmail, sendPropertyRejectedEmail } = await import('@/lib/mailer');
          if (updated.approvalStatus === 'approved') {
            sendPropertyApprovedEmail(seller.email, seller.name, updated.title, updated.slug).catch(console.error);
          } else {
            sendPropertyRejectedEmail(seller.email, seller.name, updated.title, updated.rejectionNote || 'No reason provided').catch(console.error);
          }
        }
      }
    }

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

    const isOwner = user.role === 'seller' && property.submittedBy === user.id;
    
    if (!can(user.role, 'deleteAnyProperty') && !isOwner) {
      return NextResponse.json({ error: 'Forbidden – you can only delete your own listings' }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
