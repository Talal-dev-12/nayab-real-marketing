import dynamic from 'next/dynamic';
import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";

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
      <StatsBar />
      <ExploreTools />
      <ExploreLocalities />
      <FeaturedProperties />
      <WhyChooseUs />
      <LatestBlogs />
      <CallToAction />
    </div>
  );
}