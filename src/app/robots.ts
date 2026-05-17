import { MetadataRoute } from 'next';

const BASE_URL = 'https://nayabrealmarketing.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/sign-in',
          '/sign-up',
          '/sign-up/',
          '/forgot-password',
          '/reset-password',
          '/verify-otp',
          '/profile',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/sign-in',
          '/sign-up',
          '/sign-up/',
          '/forgot-password',
          '/reset-password',
          '/verify-otp',
          '/profile',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}