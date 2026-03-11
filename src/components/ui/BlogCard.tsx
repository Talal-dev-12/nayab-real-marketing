import Link from 'next/link';
import { Calendar, User, Eye, MapPin, Building2 } from 'lucide-react';
import { Blog } from '@/types';

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col">
      <div className="overflow-hidden h-48 relative">
        <img
          src={blog.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Area / Scheme overlay badges */}
        {(blog.areaLabel || blog.schemeLabel) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 flex flex-wrap gap-1.5">
            {blog.areaLabel && (
              <Link href={`/blogs/areas/${blog.areaSlug}`}
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full border border-white/30 transition-colors">
                <MapPin size={9} /> {blog.areaLabel}
              </Link>
            )}
            {blog.schemeLabel && (
              <Link href={`/blogs/schemes/${blog.schemeSlug}`}
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full transition-colors">
                <Building2 size={9} /> {blog.schemeLabel}
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-red-600" />
            {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} className="text-red-600" />
            {blog.views}
          </span>
        </div>
        <span className="text-xs font-semibold text-red-700 uppercase tracking-wide bg-red-50 px-2 py-1 rounded w-fit">
          {blog.category}
        </span>
        <h3 className="font-bold text-[#1a2e5a] mt-2 mb-2 group-hover:text-red-700 transition-colors line-clamp-2 flex-1">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
        <Link
          href={`/blog/${blog.slug}`}
          className="text-red-700 font-semibold text-sm hover:underline mt-auto"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}
