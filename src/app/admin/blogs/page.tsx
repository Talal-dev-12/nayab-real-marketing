'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { defaultBlogs, getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/data';
import type { Blog } from '@/types';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBlogs(getFromStorage(STORAGE_KEYS.BLOGS, defaultBlogs));
  }, []);

  const togglePublish = (id: string) => {
    const updated = blogs.map(b => b.id === id ? { ...b, published: !b.published } : b);
    setBlogs(updated);
    saveToStorage(STORAGE_KEYS.BLOGS, updated);
  };

  const deleteBlog = (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    saveToStorage(STORAGE_KEYS.BLOGS, updated);
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Blog Posts</h2>
          <p className="text-slate-500 text-sm">{blogs.length} total posts</p>
        </div>
        <Link href="/admin/blogs/new" className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> New Post
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex gap-3">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-slate-400" />
          <input type="text" placeholder="Search blogs..." className="outline-none text-sm flex-1" onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Views</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(blog => (
              <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={blog.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="font-semibold text-[#1a2e5a] line-clamp-1 max-w-xs">{blog.title}</p>
                      <p className="text-xs text-slate-400">{blog.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold">{blog.category}</span>
                </td>
                <td className="px-5 py-4 text-slate-500 hidden lg:table-cell text-xs">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-slate-500 hidden md:table-cell">{blog.views}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${blog.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublish(blog.id)}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-[#1a2e5a]"
                      title={blog.published ? 'Unpublish' : 'Publish'}
                    >
                      {blog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <Link href={`/admin/blogs/${blog.id}/edit`} className="p-1.5 rounded hover:bg-blue-50 text-blue-600">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => deleteBlog(blog.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p>No blog posts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FileText({ size, className }: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}
