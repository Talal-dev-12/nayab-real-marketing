import { Metadata } from 'next';
import PropertyDetailClient from './PropertyDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXTAUTH_URL || 'https://nayabrealmarketing.com';
  
  try {
    const res = await fetch(`${baseUrl}/api/properties?slug=${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Not found');
    
    const property = await res.json();
    if (!property) throw new Error('Not found');

    const title = property.metaTitle || property.title;
    const description = property.metaDescription || property.description?.slice(0, 160) || 'Property details on Nayab Real Marketing';
    const keywords = property.metaKeywords || `${property.location}, ${property.type}, properties for ${property.priceType}, Nayab Real Marketing`;
    const image = property.images?.[0] || `${baseUrl}/og-default.jpg`;

    return {
      title: `${title} | Nayab Real Marketing`,
      description,
      keywords,
      openGraph: {
        title: `${title} - Nayab Real Marketing`,
        description,
        url: `${baseUrl}/properties/${slug}`,
        siteName: 'Nayab Real Marketing',
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `${baseUrl}/properties/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Property Details | Nayab Real Marketing',
      description: 'View property details and find your next investment with Nayab Real Marketing.',
    };
  }
}

export default function PropertyPage() {
  return <PropertyDetailClient />;
}
