import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContactMessage } from '@/models/ContactMessage';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

// --- Simple in-memory rate limiter ---
// Tracks { timestamp[] } per IP. Resets on server restart (good enough for Next.js edge/serverless).
// For production at scale, replace with Redis (e.g. Upstash).
const ipSubmits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window
const RATE_LIMIT_MAX = 5;                      // max 5 messages per IP per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipSubmits.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  ipSubmits.set(ip, [...timestamps, now]);
  return false;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Reject obvious spam patterns in text fields
function looksLikeSpam(text: string): boolean {
  const spamPatterns = [
    /https?:\/\//gi,          // URLs in name/subject
    /\b(viagra|casino|crypto|bitcoin|loan|prize|winner|click here)\b/gi,
    /<[^>]+>/g,               // HTML tags
  ];
  return spamPatterns.some(p => p.test(text));
}

// PUBLIC: Submit contact form
export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Required field validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required' }, { status: 400 });
    }

    // Length guards
    if (name.length > 100 || email.length > 150 || subject.length > 200 || message.length > 2000) {
      return NextResponse.json({ error: 'One or more fields exceed maximum length' }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message is too short' }, { status: 400 });
    }

    // Spam content check on name and subject (not message — too aggressive)
    if (looksLikeSpam(name) || looksLikeSpam(subject)) {
      // Silently accept but don't save — spammer gets no signal
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim().slice(0, 20),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('POST contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PROTECTED: Get all messages (admin only)
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
