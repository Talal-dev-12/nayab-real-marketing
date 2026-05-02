import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from "@/components/sections/HeroSection";

export const metadata: Metadata = {
  title: "Nayab Real Marketing | Premium Real Estate in Pakistan",
  description: "Find your dream property with Nayab Real Marketing. We offer verified listings, expert investment consulting, and comprehensive real estate services in Karachi and across Pakistan.",
  keywords: "real estate Pakistan, properties Karachi, buy house Karachi, Nayab Real Marketing, property investment",
  openGraph: {
    title: "Nayab Real Marketing | Premium Real Estate in Pakistan",
    description: "Discover verified property listings, investment guides, and real estate services in Karachi.",
    url: "https://nayabrealmarketing.com",
    siteName: "Nayab Real Marketing",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

// Lazy load below-the-fold components
const ExploreTools = dynamic(() => import('@/components/sections/ExploreTools'), { ssr: true });
const ExploreLocalities = dynamic(() => import('@/components/sections/ExploreLocalities'), { ssr: true });
const FeaturedProperties = dynamic(() => import('@/components/sections/FeaturedProperties'), { ssr: true });
const WhyChooseUs = dynamic(() => import('@/components/sections/WhyChooseUs'), { ssr: true });
const LatestBlogs = dynamic(() => import('@/components/sections/LatestBlogs'), { ssr: true });
const CallToAction = dynamic(() => import('@/components/sections/CallToAction'), { ssr: true });

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <ExploreTools />
      <ExploreLocalities />
      <WhyChooseUs />
      <FeaturedProperties />
      <LatestBlogs />
      <CallToAction />
    </div>
  );
}