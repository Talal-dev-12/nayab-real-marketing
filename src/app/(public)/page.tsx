"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/ui/PropertyCard";
import BlogCard from "@/components/ui/BlogCard";
import {
  PropertyCardSkeleton,
  BlogCardSkeleton,
} from "@/components/ui/Skeleton";
import {
  Search,
  Home,
  Building2,
  MapPin,
  Star,
  Phone,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
  Shield,
} from "lucide-react";
import type { Property, Blog } from "@/types";
import ExploreTools from "@/components/sections/ExploreTools";
import ExploreLocalities from "@/components/sections/ExploreLocalities";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [propsLoading, setPropsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [searchType, setSearchType] = useState<"all" | "sale" | "rent">("all");
  const [location, setLocation] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetch("/api/properties?featured=true&status=available&limit=6")
      .then((r) => r.json())
      .then((d) => setProperties(d.properties ?? []))
      .catch(() => {})
      .finally(() => setPropsLoading(false));

    fetch("/api/blogs?published=true&limit=3")
      .then((r) => r.json())
      .then((d) => setBlogs(d.blogs ?? []))
      .catch(() => {})
      .finally(() => setBlogsLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000); // har 10 sec change

    return () => clearInterval(interval);
  }, []);


  const images = [
  "https://images.unsplash.com/photo-1759323050124-eb669cec0b72?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1759323049966-8ae3fc89c0ce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGFraXN0YW4lMjBidWlsZGluZ3N8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1546560497-f83676a877cc?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section
        className="relative min-h-[92vh] flex items-center"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Star size={14} fill="currentColor" /> Pakistan's Trusted Real
              Estate Partner
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Find Your <span className="text-red-400">Perfect</span>
              <br /> Property in Pakistan
            </h1>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
              Explore thousands of verified properties across Karachi, Lahore,
              and Islamabad. Buy, sell, or rent with Nayab Real Marketing — your
              trusted partner since 2010.
            </p>
            <div className="bg-white rounded-2xl shadow-2xl p-4">
              <div className="flex gap-2 mb-4">
                {(["all", "sale", "rent"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${searchType === t ? "bg-red-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {t === "all"
                      ? "All"
                      : t === "sale"
                        ? "For Sale"
                        : "For Rent"}
                  </button>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                  <Search size={18} className="text-red-600" />
                  <input
                    type="text"
                    placeholder="Search by area, city, or property type..."
                    className="flex-1 outline-none text-gray-700 text-sm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[160px]">
                  <Building2 size={18} className="text-red-600" />
                  <select className="flex-1 outline-none text-gray-700 text-sm bg-transparent">
                    <option>Property Type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Plot</option>
                    <option>Office</option>
                  </select>
                </div>
                <Link
                  href={`/properties${searchType !== "all" ? `?type=${searchType}` : ""}${location ? `&location=${location}` : ""}`}
                  className="bg-red-700 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Search size={16} /> Search Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-[#1a2e5a] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { icon: Home, value: "2,500+", label: "Total Properties" },
              { icon: Users, value: "1,200+", label: "Happy Clients" },
              { icon: Award, value: "14+", label: "Years Experience" },
              { icon: MapPin, value: "8", label: "Cities Covered" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="text-red-400" size={28} />
                <div className="text-3xl font-extrabold">{value}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore Tools ── */}
      <ExploreTools />

      {/* ── Explore Areas & Schemes ── */}
      <ExploreLocalities />

      {/* ── Featured Properties ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-subtitle">What We Offer</p>
          <h2 className="text-4xl font-extrabold text-[#1a2e5a]">
            Featured Properties
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Explore our handpicked selection of premium properties across
            Pakistan's top cities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propsLoading
            ? [...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.map((p) => <PropertyCard key={p._id} property={p} />)}
        </div>
        {!propsLoading && (
          <div className="text-center mt-10">
            <Link
              href="/properties"
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Properties →
            </Link>
          </div>
        )}
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-[#0f1e3d] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-red-400 font-semibold uppercase tracking-widest text-sm mb-2">
              Why Choose Us
            </p>
            <h2 className="text-4xl font-extrabold text-white">
              The Nayab Real Advantage
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Properties",
                desc: "Every property is personally verified by our expert team for authenticity and legal clarity.",
              },
              {
                icon: TrendingUp,
                title: "Best Market Price",
                desc: "We ensure you get the best value for your investment with our market intelligence.",
              },
              {
                icon: Users,
                title: "Expert Agents",
                desc: "Our experienced agents guide you through every step of the buying or renting process.",
              },
              {
                icon: CheckCircle,
                title: "Legal Assistance",
                desc: "Complete documentation support for hassle-free property transactions.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-slate-800 rounded-xl p-6 text-center hover:bg-red-700 transition-colors duration-300 group"
              >
                <div className="w-14 h-14 bg-red-700 group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon
                    size={24}
                    className="text-white group-hover:text-red-700 transition-colors"
                  />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 group-hover:text-white text-sm leading-relaxed transition-colors">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Blogs ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-subtitle">Our Blog</p>
          <h2 className="text-4xl font-extrabold text-[#1a2e5a]">
            Latest News & Insights
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogsLoading
            ? [...Array(3)].map((_, i) => <BlogCardSkeleton key={i} />)
            : blogs.map((b) => <BlogCard key={b._id} blog={b} />)}
        </div>
        {!blogsLoading && blogs.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Articles →
            </Link>
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1a2e5a] opacity-90" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Get a free consultation with our real estate experts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-red-700 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-base transition-colors"
            >
              Get Free Consultation
            </Link>
            <a
              href="tel:+923212869000"
              className="border-2 border-white text-white hover:bg-white hover:text-[#1a2e5a] px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center gap-2 justify-center"
            >
              <Phone size={18} /> Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
