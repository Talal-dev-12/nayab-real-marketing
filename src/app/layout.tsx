import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title:
    "Nayab Real Marketing | Properties for Sale in Karachi | Plots & Houses",
  description:
    "Find houses, plots, and commercial properties for sale in Karachi including Scheme 33, Bahria Town, DHA City and more. Trusted real estate services by Nayab Real Marketing.",
  keywords:
    "real estate Karachi, property Pakistan, houses for sale, plots for sale, Nayab Real Marketing",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Nayab Real Marketing | Properties in Karachi",
    description:
      "Buy and sell properties in Karachi including houses, plots and commercial properties.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Nayab Real Marketing",
    type: "website",
    images: [
      {
        url: "https://nayabrealmarketing.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nayab Real Marketing",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Nayab Real Marketing",
              url: process.env.NEXT_PUBLIC_BASE_URL,
              telephone: "+923212869000",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Karachi",
                addressCountry: "Pakistan",
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning><Analytics />{children}</body>
    </html>
  );
}
