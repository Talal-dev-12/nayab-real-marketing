import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pakistan Property Price Trends 2024-2025 | Nayab Real Marketing',
  description: 'Stay updated with the latest real estate market trends, property price fluctuations, and investment insights in Pakistan provided by Nayab Real Marketing.',
};

export default function PropertyTrendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
