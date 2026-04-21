import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Real Estate Blog & Guides | Nayab Real Marketing",
  description: "Read the latest real estate news, market updates, and investment guides for housing schemes and areas in Karachi, Pakistan.",
  keywords: "real estate blog Pakistan, property investment tips, Karachi housing schemes, market updates",
  openGraph: {
    title: "Real Estate Blog & Guides | Nayab Real Marketing",
    description: "Read the latest real estate news, market updates, and investment guides.",
    url: "https://nayabrealmarketing.com/blog",
    siteName: "Nayab Real Marketing",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
