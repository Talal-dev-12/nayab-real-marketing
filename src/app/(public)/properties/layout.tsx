import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Properties for Sale & Rent | Nayab Real Marketing",
  description: "Browse verified properties for sale and rent in Karachi and across Pakistan. Find residential, commercial, and investment properties with Nayab Real Marketing.",
  keywords: "properties for sale Karachi, houses for rent, commercial plots, real estate listings Pakistan",
  openGraph: {
    title: "Properties for Sale & Rent | Nayab Real Marketing",
    description: "Browse verified properties for sale and rent in Karachi and across Pakistan.",
    url: "https://nayabrealmarketing.com/properties",
    siteName: "Nayab Real Marketing",
    type: "website",
  },
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
