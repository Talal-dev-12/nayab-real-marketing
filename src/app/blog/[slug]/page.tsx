import type { Metadata } from 'next';
import BlogDetailClient from './BlogDetailClient';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://nayabrealestate.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/blogs?slug=${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('not found');
    const blog = await res.json();
    const title = blog.metaTitle || blog.title;
    const description = blog.metaDescription || blog.excerpt?.slice(0, 160);
    const keywords = blog.metaKeywords || blog.tags?.join(', ');
    const image = blog.image || `${BASE_URL}/og-default.jpg`;

    return {
      title: `${title} | Nayab Real Marketing`,
      description,
      keywords,
      authors: [{ name: blog.author || 'Nayab Real Marketing' }],
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/blog/${slug}`,
        siteName: 'Nayab Real Marketing',
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        type: 'article',
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: [blog.author],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `${BASE_URL}/blog/${slug}`,
      },
      robots: blog.published
        ? { index: true, follow: true, googleBot: { index: true, follow: true } }
        : { index: false, follow: false },
    };
  } catch {
    return {
      title: 'Blog | Nayab Real Marketing',
      description: 'Real estate insights, tips, and market updates from Pakistan\'s trusted property experts.',
    };
  }
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}