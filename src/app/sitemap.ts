import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import { Blog } from '@/models/Blog';


const BASE_URL = 'https://nayabrealmarketing.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              BASE_URL,
      lastModified:     new Date(),
      changeFrequency:  'daily',
      priority:         1.0,
    },
    {
      url:              `${BASE_URL}/properties`,
      lastModified:     new Date(),
      changeFrequency:  'daily',
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/blog`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/agents`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.7,
    },
    {
      url:              `${BASE_URL}/about`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/services`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/contact`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.5,
    },
    {
      url:              `${BASE_URL}/tools/mortgage-calculator`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.5,
    },
    {
      url:              `${BASE_URL}/tools/property-index`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.5,
    },
    {
      url:              `${BASE_URL}/tools/property-trends`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.5,
    },
    {
      url:              `${BASE_URL}/privacy-policy`,
      lastModified:     new Date(),
      changeFrequency:  'yearly',
      priority:         0.3,
    },
    {
      url:              `${BASE_URL}/terms-of-service`,
      lastModified:     new Date(),
      changeFrequency:  'yearly',
      priority:         0.3,
    },
  ];

  // ── Dynamic: Properties ───────────────────────────────────────────────────
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const properties = await Property.find(
      { status: 'available' },
      { slug: 1, updatedAt: 1 }   // fetch only what we need
    ).lean();

    propertyPages = properties.map((p) => ({
      url:             `${BASE_URL}/properties/${p.slug}`,
      lastModified:    p.updatedAt ? new Date(p.updatedAt as string) : new Date(),
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    }));
  } catch {
    // If DB is unavailable during build, skip dynamic pages gracefully
    console.warn('Sitemap: could not fetch properties');
  }

  // ── Dynamic: Blog posts ───────────────────────────────────────────────────
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogs = await Blog.find(
      { published: true },
      { slug: 1, updatedAt: 1 }
    ).lean();

    blogPages = blogs.map((b) => ({
      url:             `${BASE_URL}/blog/${b.slug}`,
      lastModified:    b.updatedAt ? new Date(b.updatedAt as string) : new Date(),
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    }));
  } catch {
    console.warn('Sitemap: could not fetch blogs');
  }

  return [...staticPages, ...propertyPages, ...blogPages];
}