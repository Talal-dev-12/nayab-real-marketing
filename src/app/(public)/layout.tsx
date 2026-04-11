import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SpeedInsights } from '@vercel/speed-insights/next';


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

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <SpeedInsights />
      <Footer />
    </>
  );
}
