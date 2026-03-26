'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BlogDetailSkeleton } from '@/components/ui/Skeleton';

import {
  ArrowLeft, Calendar, User, Eye, Tag, Clock,
  Share2, ChevronRight, ChevronLeft, X, Linkedin, Facebook
} from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  images: string[];
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  areaSlug?: string;
  areaLabel?: string;
  schemeSlug?: string;
  schemeLabel?: string;
  createdAt: string;
  updatedAt: string;
}

// X (formerly Twitter) logo — lucide's Twitter icon is the old bird
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.731-8.843L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function BlogDetailClient() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs?slug=${params.slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.published) { setLoading(false); return; }
        setBlog(data);
        fetch(`/api/blogs?published=true&category=${encodeURIComponent(data.category)}&limit=5`)
          .then(r => r.json()).then(d => {
            setRelated((d.blogs ?? []).filter((b: Blog) => b._id !== data._id).slice(0, 3));
          }).catch(() => {});
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [params.slug]);

  // Lightbox keyboard navigation
  useEffect(() => {
    const allImages = blog ? [blog.image, ...(blog.images || [])].filter(Boolean) : [];
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(l => ({ ...l, open: false }));
      if (e.key === 'ArrowRight') setLightbox(l => ({ ...l, idx: (l.idx + 1) % allImages.length }));
      if (e.key === 'ArrowLeft') setLightbox(l => ({ ...l, idx: (l.idx - 1 + allImages.length) % allImages.length }));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [blog]);

  const [lightbox, setLightbox] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });

  const allImages = blog ? [blog.image, ...(blog.images || [])].filter(Boolean) : [];
  const readingTime = blog ? Math.max(1, Math.ceil(blog.content.replace(/<[^>]+>/g, '').split(' ').length / 200)) : 0;

  const share = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog?.title || '');
    const links: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x:        `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(links[platform], '_blank');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
    
      <BlogDetailSkeleton />
     
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="text-8xl mb-6">📰</div>
        <h1 className="text-3xl font-extrabold text-[#1a2e5a] mb-3">Article Not Found</h1>
        <p className="text-slate-500 mb-8">This article doesn't exist or has been removed.</p>
        <Link href="/blog" className="inline-flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
          <ArrowLeft size={18} /> Back to Blog
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
 

      {/* ── Hero ── */}
      <div className="relative h-[320px] sm:h-[420px] md:h-[520px] overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e3d]/95 via-[#0f1e3d]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 md:pb-12 md:px-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm mb-3 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={13} />
            <span className="text-white line-clamp-1">{blog.title}</span>
          </div>
          <span className="inline-block bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            {blog.category}
          </span>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-slate-300 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5"><User size={13} /><span>{blog.author}</span></div>
            <div className="flex items-center gap-1.5"><Calendar size={13} /><span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div className="flex items-center gap-1.5"><Clock size={13} /><span>{readingTime} min read</span></div>
            <div className="flex items-center gap-1.5"><Eye size={13} /><span>{blog.views?.toLocaleString()} views</span></div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* ── Article ── */}
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-8 md:p-12">
              {/* Lead */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed border-l-4 border-red-700 pl-4 sm:pl-5 mb-6 sm:mb-8 italic">
                {blog.excerpt}
              </p>

              {/* Content — images are embedded inline by the author */}
              <div
                className="prose prose-base sm:prose-lg max-w-none
                  prose-headings:text-[#1a2e5a] prose-headings:font-extrabold
                  prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[#1a2e5a]
                  prose-blockquote:border-l-red-700 prose-blockquote:text-slate-500
                  prose-img:rounded-xl prose-img:shadow-md
                  prose-ul:text-slate-700 prose-ol:text-slate-700
                  prose-li:marker:text-red-700"
                style={{ lineHeight: '1.85', color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={15} className="text-red-700 shrink-0" />
                    {blog.tags.map((tag: string) => (
                      <span key={tag} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-red-100">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="font-bold text-[#1a2e5a] mb-3 text-sm sm:text-base">Share this article</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => share('facebook')}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors">
                    <Facebook size={14} /> Facebook
                  </button>
                  <button onClick={() => share('linkedin')}
                    className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors">
                    <Linkedin size={14} /> LinkedIn
                  </button>
                  <button onClick={() => share('x')}
                    className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors">
                    <XIcon size={18} />
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors">
                    <Share2 size={14} /> {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>

            {/* Author box */}
            <div className="bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] rounded-2xl p-6 sm:p-8 mt-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
                {blog.author[0]}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Written by</p>
                <h3 className="text-white font-extrabold text-xl">{blog.author}</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">Real estate expert with deep knowledge of Pakistan's property market, helping buyers, sellers, and investors make informed decisions.</p>
              </div>
            </div>

            <div className="mt-5">
              <Link href="/blog" className="inline-flex items-center gap-2 text-red-700 font-semibold hover:underline text-sm">
                <ArrowLeft size={15} /> Back to All Articles
              </Link>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-5">
            {related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-5 pb-3 border-b">Related Articles</h3>
                <div className="space-y-4">
                  {related.map((rel: Blog) => (
                    <Link key={rel._id} href={`/blog/${rel.slug}`} className="group flex gap-3">
                      <img src={rel.image} alt={rel.title} className="w-20 h-16 object-cover rounded-lg shrink-0 group-hover:opacity-80 transition-opacity" />
                      <div className="min-w-0">
                        <span className="text-xs text-red-700 font-semibold">{rel.category}</span>
                        <h4 className="text-sm font-bold text-[#1a2e5a] line-clamp-2 group-hover:text-red-700 transition-colors leading-snug">{rel.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(rel.createdAt).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-2xl p-5 sm:p-6 text-white">
              <h3 className="font-extrabold text-xl mb-2">Looking for a Property?</h3>
              <p className="text-red-100 text-sm mb-5 leading-relaxed">Our expert agents are ready to help you find your dream property in Pakistan.</p>
              <Link href="/contact" className="block bg-white text-red-700 font-bold text-center py-3 rounded-xl hover:bg-red-50 transition-colors text-sm">
                Contact Us Today
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
              <h3 className="font-extrabold text-[#1a2e5a] text-base mb-4">Article Info</h3>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: 'Published', value: new Date(blog.createdAt).toLocaleDateString() },
                  { label: 'Updated',   value: new Date(blog.updatedAt).toLocaleDateString() },
                  { label: 'Category',  value: blog.category },
                  { label: 'Reading Time', value: `${readingTime} min` },
                  { label: 'Views',     value: blog.views?.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-[#1a2e5a]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox.open && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(l => ({ ...l, open: false }))}>
          <button className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
            onClick={() => setLightbox(l => ({ ...l, open: false }))}>
            <X size={28} />
          </button>
          {allImages.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: (l.idx - 1 + allImages.length) % allImages.length })); }}
                className="absolute left-3 sm:left-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-10">
                <ChevronLeft size={24} />
              </button>
              <button onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: (l.idx + 1) % allImages.length })); }}
                className="absolute right-3 sm:right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-10">
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
            <img src={allImages[lightbox.idx]} alt={`Photo ${lightbox.idx + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-xl" />
            <p className="text-center text-slate-400 text-sm mt-3">{lightbox.idx + 1} / {allImages.length}</p>
          </div>
        </div>
      )}

    </div>
  );
}