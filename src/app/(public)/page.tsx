import ExploreTools from "@/components/sections/ExploreTools";
import ExploreLocalities from "@/components/sections/ExploreLocalities";
import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import LatestBlogs from "@/components/sections/LatestBlogs";
import CallToAction from "@/components/sections/CallToAction";

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