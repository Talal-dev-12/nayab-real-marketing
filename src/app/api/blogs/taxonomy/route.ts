import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { Area } from '@/models/Area';
import { HousingScheme } from '@/models/HousingScheme';

/**
 * GET /api/blogs/taxonomy
 * Returns all managed areas and schemes with blog counts representing published blogs.
 */
export async function GET() {
  try {
    await connectDB();

    // Fetch managed areas and schemes, sorted by order
    const [areasData, schemesData] = await Promise.all([
      Area.find().sort({ order: 1, name: 1 }),
      HousingScheme.find().sort({ order: 1, name: 1 })
    ]);

    // Aggregate counts of published blogs by areaSlug and schemeSlug
    const [areaCounts, schemeCounts] = await Promise.all([
      Blog.aggregate([
        { $match: { published: true, areaSlug: { $ne: '' } } },
        { $group: { _id: '$areaSlug', count: { $sum: 1 } } }
      ]),
      Blog.aggregate([
        { $match: { published: true, schemeSlug: { $ne: '' } } },
        { $group: { _id: '$schemeSlug', count: { $sum: 1 } } }
      ])
    ]);

    // Map counts into dictionaries
    const areaCountMap = areaCounts.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
    const schemeCountMap = schemeCounts.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

    // Map areas to AreaSummary interface
    const areas = areasData.map(d => ({
      slug: d.slug,
      label: d.name,
      image: d.image || '',
      blogCount: areaCountMap[d.slug] || 0,
      schemes: schemesData
        .filter(s => s.areaId === d._id.toString())
        .map(s => ({
          slug: s.slug,
          label: s.name,
          logo: s.logo || '',
          image: s.image || '',
          areaSlug: d.slug,
          areaLabel: d.name,
          blogCount: schemeCountMap[s.slug] || 0
        }))
    }));

    // Map all schemes to SchemeSummary interface
    const schemes = schemesData.map(d => ({
      slug: d.slug,
      label: d.name,
      logo: d.logo || '',
      image: d.image || '',
      areaSlug: d.areaName ? d.areaName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '',
      areaLabel: d.areaName || '',
      blogCount: schemeCountMap[d.slug] || 0
    }));

    return NextResponse.json({ areas, schemes });
  } catch (error) {
    console.error('Taxonomy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
