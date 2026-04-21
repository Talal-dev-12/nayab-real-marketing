import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Real Estate Agents | Nayab Real Marketing",
  description: "Meet the expert real estate agents and property consultants at Nayab Real Marketing. Get professional guidance for buying, selling, and investing in Pakistan.",
  keywords: "real estate agents Karachi, property consultants, Nayab Real Marketing team",
  openGraph: {
    title: "Our Real Estate Agents | Nayab Real Marketing",
    description: "Meet the expert real estate agents and property consultants at Nayab Real Marketing.",
    url: "https://nayabrealmarketing.com/agents",
    siteName: "Nayab Real Marketing",
    type: "website",
  },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
