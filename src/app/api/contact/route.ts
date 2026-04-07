import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContactMessage } from '@/models/ContactMessage';
import { User } from '@/models/User';
import { requireAuth, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';
import { sendContactNotification } from '@/lib/mailer';

// ── Rate limiter ──
const ipSubmits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipSubmits.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  ipSubmits.set(ip, [...timestamps, now]);
  return false;
}

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

function looksLikeSpam(text: string): boolean {
  const patterns = [/https?:\/\//gi, /\b(viagra|casino|crypto|bitcoin|loan|prize|winner|click here)\b/gi, /<[^>]+>/g];
  return patterns.some(p => p.test(text));
}

// PROTECTED: Submit contact form
export const POST = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    }

    await connectDB();
    const body = await req.json();
    const { subject, message, propertyTitle, phone } = body;

    // Use name and email from JWT for security/consistency
    const name = user.name;
    const email = user.email;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }
    if (subject.length > 200 || message.length > 2000) {
      return NextResponse.json({ error: 'One or more fields exceed maximum length' }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message is too short' }, { status: 400 });
    }
    if (looksLikeSpam(subject)) {
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    // Save to DB
    await ContactMessage.create({
      userId: user.id,
      name,
      email: email.toLowerCase(),
      phone: (phone || '').trim().slice(0, 20),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send email notification to all active admins (non-blocking)
    try {
      const admins = await User.find({ active: true, role: { $in: ['manager', 'superadmin'] } }).select('email').lean();
      const adminEmails = (admins as any[]).map((a: any) => a.email).filter(Boolean);
      if (adminEmails.length > 0 && process.env.SMTP_USER) {
        await sendContactNotification({
          to: adminEmails,
          fromName: name,
          fromEmail: email,
          phone: phone?.trim(),
          subject: subject.trim(),
          message: message.trim(),
          propertyTitle: propertyTitle?.trim(),
        });
      }
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr);
    }

    return NextResponse.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('POST contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// PROTECTED: Get all messages
export const GET = requireAuth(async (req: NextRequest, _user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const read = searchParams.get('read');
    const filter: Record<string, unknown> = {};
    if (read !== null) filter.read = read === 'true';
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
