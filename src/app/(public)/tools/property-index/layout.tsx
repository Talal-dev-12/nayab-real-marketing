import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Price Index | Nayab Real Marketing',
  description: 'Explore the latest property price index and compare average property prices per square foot across top areas in Pakistan with Nayab Real Marketing.',
};

export default function PropertyIndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
