import Link from 'next/link';
import { Calendar, User, Eye } from 'lucide-react';
import { Blog } from '@/types';

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="overflow-hidden h-48">
        <img
          src={blog.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-red-600" />
            {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <User size={12} className="text-red-600" />
            {blog.author}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} className="text-red-600" />
            {blog.views}
          </span>
        </div>
        <span className="text-xs font-semibold text-red-700 uppercase tracking-wide bg-red-50 px-2 py-1 rounded">
          {blog.category}
        </span>
        <h3 className="font-bold text-[#1a2e5a] mt-2 mb-2 group-hover:text-red-700 transition-colors line-clamp-2">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
        <Link
          href={`/blog/${blog.slug}`}
          className="text-red-700 font-semibold text-sm hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}
