import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { HousingScheme } from '@/models/HousingScheme';
import { requireAdmin, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';

function makeSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// PUBLIC: list all housing schemes (sorted by order)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');
    
    let query = HousingScheme.find().sort({ order: 1, name: 1 });

    if (pageParam && limitParam) {
      const page = parseInt(pageParam) || 1;
      const limit = parseInt(limitParam) || 10;
      const skip = (page - 1) * limit;
      
      const [schemes, total] = await Promise.all([
        HousingScheme.find().sort({ order: 1, name: 1 }).skip(skip).limit(limit),
        HousingScheme.countDocuments()
      ]);
      
      return NextResponse.json({ 
        schemes,
        total,
        pages: Math.ceil(total / limit)
      });
    }

    const schemes = await query;
    return NextResponse.json({ schemes, total: schemes.length, pages: 1 });
  } catch (error) {
    console.error('GET schemes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ADMIN: create a new housing scheme
export const POST = requireAdmin(async (req: NextRequest, _user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, logo, image, areaId, areaName, description, order } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Scheme name is required' }, { status: 400 });
    }

    const slug = makeSlug(name);
    const existing = await HousingScheme.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'A scheme with this name already exists' }, { status: 409 });
    }

    const scheme = await HousingScheme.create({
      name: name.trim(),
      slug,
      logo: logo || '',
      image: image || '',
      areaId: areaId || '',
      areaName: areaName || '',
      description: description || '',
      order: order ?? 0,
    });

    return NextResponse.json(scheme, { status: 201 });
  } catch (error) {
    console.error('POST scheme error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
