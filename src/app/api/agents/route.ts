import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Agent } from '@/models/Agent';
import { requireAuth, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const active = searchParams.get('active');
    const filter: Record<string, unknown> = {};
    if (active !== null) filter.active = active === 'true';
    const agents = await Agent.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(agents);
  } catch (error) {
    console.error('GET agents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = requireAuth(async (req: NextRequest, _user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone } = body;
    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required' }, { status: 400 });
    }
    const existing = await Agent.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Agent with this email already exists' }, { status: 409 });
    }
    const agent = await Agent.create(body);
    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('POST agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
