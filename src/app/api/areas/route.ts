import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Area } from '@/models/Area';
import { requireAdmin, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';

function makeSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// PUBLIC: list all areas (sorted by order)
export async function GET() {
  try {
    await connectDB();
    const areas = await Area.find().sort({ order: 1, name: 1 });
    return NextResponse.json({ areas });
  } catch (error) {
    console.error('GET areas error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ADMIN: create a new area
export const POST = requireAdmin(async (req: NextRequest, _user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, image, description, order } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Area name is required' }, { status: 400 });
    }

    const slug = makeSlug(name);
    const existing = await Area.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'An area with this name already exists' }, { status: 409 });
    }

    const area = await Area.create({
      name: name.trim(),
      slug,
      image: image || '',
      description: description || '',
      order: order ?? 0,
    });

    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error('POST area error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
