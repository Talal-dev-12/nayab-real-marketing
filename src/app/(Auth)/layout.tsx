import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";


export const metadata: Metadata = {
  title:
    "Nayab Real Marketing | Sign In to Your Account",
  description:
    "Access your Nayab Real Marketing account to manage your property listings, view saved properties, and connect with potential buyers or sellers in Karachi.",
  keywords:
    "real estate Karachi, property Pakistan, sign in, account management, Nayab Real Marketing",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },
  openGraph: {
    title: "Nayab Real Marketing | Sign In to Your Account",
    description:
      "Access your Nayab Real Marketing account to manage your property listings, view saved properties, and connect with potential buyers or sellers in Karachi.",
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
      </head>
      <body>
        <Navbar />
        {children}
        
           </body>
    </html>
  );
}
