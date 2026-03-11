import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

// ── helpers ──────────────────────────────────────────────────────────────────
function makeSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// PUBLIC: GET blogs (with area / scheme filtering)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const sp = new URL(req.url).searchParams;
    const slug      = sp.get('slug');
    const category  = sp.get('category');
    const published = sp.get('published');
    const areaSlug  = sp.get('area');
    const schemeSlug = sp.get('scheme');
    const limit     = parseInt(sp.get('limit') || '50');
    const page      = parseInt(sp.get('page') || '1');

    // Single blog by slug
    if (slug) {
      const blog = await Blog.findOne({ slug });
      if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
      return NextResponse.json(blog);
    }

    const filter: Record<string, unknown> = {};
    if (category)   filter.category   = category;
    if (published !== null) filter.published = published === 'true';
    if (areaSlug)   filter.areaSlug   = areaSlug;
    if (schemeSlug) filter.schemeSlug = schemeSlug;

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(filter),
    ]);
    return NextResponse.json({ blogs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('GET blogs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PROTECTED: Create blog
export const POST = requireAuth(async (req: NextRequest, _user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const body = await req.json();
    const {
      title, slug, excerpt, content, image, images, author, category,
      tags, published, metaTitle, metaDescription, metaKeywords,
      areaSlug, areaLabel, schemeSlug, schemeLabel,
    } = body;

    if (!title || !content || !excerpt) {
      return NextResponse.json({ error: 'Title, content, and excerpt are required' }, { status: 400 });
    }

    const generatedSlug = slug || makeSlug(title);
    const existing = await Blog.findOne({ slug: generatedSlug });
    if (existing) {
      return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 409 });
    }

    const blog = await Blog.create({
      title, slug: generatedSlug, excerpt, content,
      image: image || '',
      images: Array.isArray(images) ? images.filter(Boolean).slice(0, 4) : [],
      author: author || 'Nayab Real Marketing',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
      published: published ?? false,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt.slice(0, 160),
      metaKeywords: metaKeywords || '',
      // Area / scheme — normalise slugs on server
      areaSlug:   areaSlug  ? makeSlug(areaSlug)   : '',
      areaLabel:  areaLabel  || '',
      schemeSlug: schemeSlug ? makeSlug(schemeSlug) : '',
      schemeLabel: schemeLabel || '',
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('POST blog error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
