"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BlogCard from "@/components/ui/BlogCard";
import { BlogCardSkeleton } from "@/components/ui/Skeleton";
import type { Blog } from "@/types";

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/blogs?published=true&limit=3")
      .then((r) => r.json())
      .then((d) => {
        if (mounted) setBlogs(d.blogs ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setBlogsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4">
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
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            View All Articles →
          </Link>
        </div>
      )}
    </section>
  );
}
