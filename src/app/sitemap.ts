import { MetadataRoute } from 'next';

const BASE_URL = 'https://nayabrealmarketing.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Core pages (highest priority) ──────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    {
      url:              BASE_URL,
      lastModified:     now,
      changeFrequency:  'daily',
      priority:         1.0,
    },
    {
      url:              `${BASE_URL}/properties`,
      lastModified:     now,
      changeFrequency:  'daily',
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/blog`,
      lastModified:     now,
      changeFrequency:  'weekly',
      priority:         0.8,
    },
  ];

  // ── Brand division pages ───────────────────────────────────────────────────
  const divisionPages: MetadataRoute.Sitemap = [
    {
      url:              `${BASE_URL}/nayab-marketing`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/nayab-construction`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/nayab-interior`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/nayab-properties`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.8,
    },
  ];

  // ── Informational pages ────────────────────────────────────────────────────
  const infoPages: MetadataRoute.Sitemap = [
    {
      url:              `${BASE_URL}/about`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.7,
    },
    {
      url:              `${BASE_URL}/services`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.7,
    },
    {
      url:              `${BASE_URL}/agents`,
      lastModified:     now,
      changeFrequency:  'weekly',
      priority:         0.7,
    },
    {
      url:              `${BASE_URL}/contact`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.6,
    },
  ];

  // ── Tools pages ────────────────────────────────────────────────────────────
  const toolPages: MetadataRoute.Sitemap = [
    {
      url:              `${BASE_URL}/tools/area-converter`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/tools/construction-calculator`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/tools/loan-calculator`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/tools/property-index`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/tools/property-trends`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.6,
    },
  ];

  // ── Legal pages ────────────────────────────────────────────────────────────
  const legalPages: MetadataRoute.Sitemap = [
    {
      url:              `${BASE_URL}/privacy-policy`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.3,
    },
    {
      url:              `${BASE_URL}/terms-of-service`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.3,
    },
  ];

  // ── Dynamic: Properties & Blogs from DB ────────────────────────────────────
  // Use dynamic imports so the sitemap still works when MONGODB_URI is missing
  let propertyPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { Property }  = await import('@/models/Property');
    const { Blog }      = await import('@/models/Blog');

    await connectDB();

    // Properties
    const properties = await Property.find(
      { status: 'available' },
      { slug: 1, updatedAt: 1 }
    ).lean();

    propertyPages = properties.map((p) => ({
      url:             `${BASE_URL}/properties/${p.slug}`,
      lastModified:    p.updatedAt ? new Date(p.updatedAt as string) : now,
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    }));

    // Blog posts
    const blogs = await Blog.find(
      { published: true },
      { slug: 1, updatedAt: 1 }
    ).lean();

    blogPages = blogs.map((b) => ({
      url:             `${BASE_URL}/blog/${b.slug}`,
      lastModified:    b.updatedAt ? new Date(b.updatedAt as string) : now,
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    }));
  } catch {
    console.warn('[Sitemap] Could not fetch dynamic data from DB — serving static URLs only.');
  }

  return [
    ...corePages,
    ...divisionPages,
    ...infoPages,
    ...toolPages,
    ...legalPages,
    ...propertyPages,
    ...blogPages,
  ];
}