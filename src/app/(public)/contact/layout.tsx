import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Nayab Real Marketing",
  description: "Get in touch with Nayab Real Marketing for your property inquiries. Visit our office in Scheme 33, Karachi, or contact us via phone or email.",
  keywords: "contact Nayab Real Marketing, real estate office Karachi, property inquiries",
  openGraph: {
    title: "Contact Us | Nayab Real Marketing",
    description: "Get in touch with Nayab Real Marketing for your property inquiries.",
    url: "https://nayabrealmarketing.com/contact",
    siteName: "Nayab Real Marketing",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
