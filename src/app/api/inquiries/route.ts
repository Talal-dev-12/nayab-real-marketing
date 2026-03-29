import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Inquiry } from '@/models/Inquiry';
import { Property } from '@/models/Property';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

// POST — authenticated user submits inquiry
export const POST = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const { propertyId, message, phone } = await req.json();

    if (!propertyId || !message?.trim()) {
      return NextResponse.json({ error: 'Property and message are required' }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message is too short (min 10 characters)' }, { status: 400 });
    }

    const property = await Property.findById(propertyId).select('title slug').lean();
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Prevent duplicate inquiry from same user for same property
    const existing = await Inquiry.findOne({ userId: user.id, propertyId });
    if (existing) {
      return NextResponse.json({ error: 'You have already sent an inquiry for this property' }, { status: 409 });
    }

    const inquiry = await Inquiry.create({
      userId:        user.id,
      userName:      user.name,
      userEmail:     user.email,
      propertyId,
      propertyTitle: (property as any).title,
      propertySlug:  (property as any).slug,
      message:       message.trim(),
      phone:         (phone || '').trim().slice(0, 20),
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('POST inquiry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// GET — admin sees all; user sees their own
export const GET = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get('mine');

    const isAdmin = ['admin', 'superadmin'].includes(user.role);

    // Non-admins can only see their own inquiries
    const filter: Record<string, unknown> = {};
    if (!isAdmin || mine === 'true') {
      filter.userId = user.id;
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('GET inquiries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
