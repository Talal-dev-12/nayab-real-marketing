import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload, UserRole } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const priceType = searchParams.get('priceType');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const slug = searchParams.get('slug');
    const filter: Record<string, unknown> = {};

    if (slug) {
      const property = await Property.findOne({ slug });
      if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } });
      return NextResponse.json(property);
    }

    if (featured !== null) filter.featured = featured === 'true';
    if (type) filter.type = type;
    if (city) filter.city = city;
    if (priceType) filter.priceType = priceType;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit),
      Property.countDocuments(filter),
    ]);
    return NextResponse.json({ properties, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('GET properties error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const body = await req.json();
    // Agents post as themselves — override agentId with their own user ID
    const role = user.role as UserRole;
    if (role === 'agent') body.agentId = user.id;
    const { title, slug, description, price, priceType, location, city, area, type, agentId } = body;
    if (!title || !description || !price || !priceType || !location || !city || !area || !type || !agentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const existing = await Property.findOne({ slug: generatedSlug });
    if (existing) {
      return NextResponse.json({ error: 'A property with this slug already exists' }, { status: 409 });
    }
    const property = await Property.create({ ...body, slug: generatedSlug });
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('POST property error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});