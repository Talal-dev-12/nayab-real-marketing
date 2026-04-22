import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Cost Calculator | Nayab Real Marketing',
  description: 'Estimate building and construction costs for your property in Pakistan instantly using the free Construction Cost Calculator by Nayab Real Marketing.',
};

export default function ConstructionCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
