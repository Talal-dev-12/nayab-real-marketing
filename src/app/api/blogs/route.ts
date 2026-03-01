import { NextRequest, NextResponse } from 'next/server';

// Mock blog data (replace with Prisma in production)
const blogs = [
  {
    id: '1',
    title: 'Top 5 Investment Areas in Karachi',
    slug: 'top-5-investment-areas-karachi',
    excerpt: 'Discover the most profitable areas for real estate investment in Karachi.',
    content: 'Full content here...',
    category: 'Investment',
    tags: 'karachi, investment, real estate',
    published: true,
    views: 1240,
    createdAt: '2024-11-10T00:00:00Z',
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const published = searchParams.get('published');

  let filtered = [...blogs];
  if (category) filtered = filtered.filter((b) => b.category === category);
  if (published === 'true') filtered = filtered.filter((b) => b.published);

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, category, tags, published } = body;

    if (!title || !content || !excerpt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In production: save to database
    // const blog = await prisma.blog.create({
    //   data: { title, slug, excerpt, content, category, tags, published },
    // });

    const newBlog = {
      id: Date.now().toString(),
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt,
      content,
      category: category || 'General',
      tags: tags || '',
      published: published || false,
      views: 0,
      createdAt: new Date().toISOString(),
    };

    console.log('New blog created:', newBlog.title);
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
