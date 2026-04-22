import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Loan Calculator | Nayab Real Marketing',
  description: 'Calculate your monthly mortgage payments and home loan interest instantly with the free Home Loan Calculator by Nayab Real Marketing.',
};

export default function LoanCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
