'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Calendar, User, Eye, Tag, Clock, Share2, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import { defaultBlogs, getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/data';
import type { Blog } from '@/types';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const all = getFromStorage<Blog[]>(STORAGE_KEYS.BLOGS, defaultBlogs);
    const found = all.find((b: Blog) => b.slug === params.slug && b.published);
    if (!found) {
      setLoading(false);
      return;
    }
    // Increment views
    const updated = all.map((b: Blog) => b.id === found.id ? { ...b, views: (b.views || 0) + 1 } : b);
    saveToStorage(STORAGE_KEYS.BLOGS, updated);
    setBlog({ ...found, views: (found.views || 0) + 1 });
    setRelated(all.filter((b: Blog) => b.id !== found.id && b.published && b.category === found.category).slice(0, 3));
    setLoading(false);
  }, [params.slug]);

  const readingTime = blog ? Math.max(1, Math.ceil(blog.content.replace(/<[^>]+>/g, '').split(' ').length / 200)) : 0;

  const share = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog?.title || '');
    const links: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(links[platform], '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="text-8xl mb-6">📰</div>
        <h1 className="text-3xl font-extrabold text-[#1a2e5a] mb-3">Article Not Found</h1>
        <p className="text-slate-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog" className="inline-flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
          <ArrowLeft size={18} /> Back to Blog
        </Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[420px] md:h-[520px] overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e3d]/90 via-[#0f1e3d]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-white line-clamp-1">{blog.title}</span>
          </div>
          <span className="inline-block bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            {blog.category}
          </span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={14} />
              <span>{blog.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Article Body */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              {/* Excerpt / Lead */}
              <p className="text-lg text-slate-600 font-medium leading-relaxed border-l-4 border-red-700 pl-5 mb-8 italic">
                {blog.excerpt}
              </p>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-[#1a2e5a] prose-headings:font-extrabold prose-a:text-red-700 prose-strong:text-[#1a2e5a]"
                style={{
                  lineHeight: '1.8',
                  color: '#374151',
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={16} className="text-red-700" />
                    {blog.tags.map(tag => (
                      <span key={tag} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="font-bold text-[#1a2e5a] mb-4">Share this article</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => share('facebook')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Facebook size={16} /> Facebook
                  </button>
                  <button onClick={() => share('twitter')} className="flex items-center gap-2 bg-sky-400 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Twitter size={16} /> Twitter
                  </button>
                  <button onClick={() => share('linkedin')} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Linkedin size={16} /> LinkedIn
                  </button>
                  <button onClick={copyLink} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Share2 size={16} /> {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>

            {/* Author Box */}
            <div className="bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] rounded-2xl p-8 mt-6 flex items-center gap-6">
              <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
                {blog.author[0]}
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Written by</p>
                <h3 className="text-white font-extrabold text-xl">{blog.author}</h3>
                <p className="text-slate-300 text-sm mt-1">Real estate expert with deep knowledge of Pakistan's property market, helping buyers, sellers, and investors make informed decisions.</p>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
              <Link href="/blog" className="inline-flex items-center gap-2 text-red-700 font-semibold hover:underline">
                <ArrowLeft size={16} /> Back to All Articles
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related Articles */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-5 pb-3 border-b">Related Articles</h3>
                <div className="space-y-5">
                  {related.map(rel => (
                    <Link key={rel.id} href={`/blog/${rel.slug}`} className="group block">
                      <div className="flex gap-3">
                        <img src={rel.image} alt={rel.title} className="w-20 h-16 object-cover rounded-lg shrink-0 group-hover:opacity-80 transition-opacity" />
                        <div>
                          <span className="text-xs text-red-700 font-semibold">{rel.category}</span>
                          <h4 className="text-sm font-bold text-[#1a2e5a] line-clamp-2 group-hover:text-red-700 transition-colors">{rel.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{new Date(rel.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-2xl p-6 text-white">
              <h3 className="font-extrabold text-xl mb-3">Looking for a Property?</h3>
              <p className="text-red-100 text-sm mb-5">Our expert agents are ready to help you find your dream property in Pakistan.</p>
              <Link href="/contact" className="block bg-white text-red-700 font-bold text-center py-3 rounded-xl hover:bg-red-50 transition-colors">
                Contact Us Today
              </Link>
            </div>

            {/* Article Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-4">Article Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Published</span>
                  <span className="font-semibold text-[#1a2e5a]">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-red-700">{blog.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reading Time</span>
                  <span className="font-semibold text-[#1a2e5a]">{readingTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Views</span>
                  <span className="font-semibold text-[#1a2e5a]">{blog.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
