import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Area Unit Converter | Nayab Real Marketing',
  description: 'Easily convert property areas between Marla, Kanal, Square Feet, Square Yards, and Acres with the free Area Unit Converter by Nayab Real Marketing.',
};

export default function AreaConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
