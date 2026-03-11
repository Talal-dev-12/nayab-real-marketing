import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';

/**
 * GET /api/blogs/taxonomy
 * Returns all unique areas and schemes derived from published blog data.
 * Zero config — pages generate automatically from blog content.
 */
export async function GET() {
  try {
    await connectDB();

    // Aggregate areas
    const areaDocs = await Blog.aggregate([
      { $match: { published: true, areaSlug: { $ne: '' } } },
      {
        $group: {
          _id: '$areaSlug',
          label: { $first: '$areaLabel' },
          blogCount: { $sum: 1 },
          schemes: {
            $addToSet: {
              $cond: [
                { $ne: ['$schemeSlug', ''] },
                { slug: '$schemeSlug', label: '$schemeLabel' },
                '$$REMOVE',
              ],
            },
          },
        },
      },
      { $sort: { blogCount: -1 } },
    ]);

    // Aggregate schemes
    const schemeDocs = await Blog.aggregate([
      { $match: { published: true, schemeSlug: { $ne: '' } } },
      {
        $group: {
          _id: '$schemeSlug',
          label: { $first: '$schemeLabel' },
          areaSlug: { $first: '$areaSlug' },
          areaLabel: { $first: '$areaLabel' },
          blogCount: { $sum: 1 },
        },
      },
      { $sort: { blogCount: -1 } },
    ]);

    const areas = areaDocs.map(d => ({
      slug: d._id,
      label: d.label || d._id,
      blogCount: d.blogCount,
      schemes: (d.schemes || []).filter(Boolean),
    }));

    const schemes = schemeDocs.map(d => ({
      slug: d._id,
      label: d.label || d._id,
      areaSlug: d.areaSlug,
      areaLabel: d.areaLabel,
      blogCount: d.blogCount,
    }));

    return NextResponse.json({ areas, schemes });
  } catch (error) {
    console.error('Taxonomy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
