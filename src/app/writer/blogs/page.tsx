'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Pencil, Trash2, BookOpen } from 'lucide-react';

export default function WriterBlogsPage() {
  const [blogs,   setBlogs]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = localStorage.getItem('writer_token');
    const user  = JSON.parse(localStorage.getItem('writer_user') || '{}');
    fetch('/api/blogs?limit=200', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setBlogs((d.blogs ?? []).filter((b: any) => b.authorId === user.id)))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    const token = localStorage.getItem('writer_token');
    await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setBlogs(prev => prev.filter(b => b._id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">My Articles</h2>
          <p className="text-slate-500 text-sm">{blogs.length} articles · {blogs.reduce((s, b) => s + (b.views || 0), 0).toLocaleString()} total views</p>
        </div>
        <Link href="/writer/blogs/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-slate-400">Loading...</div>
        : blogs.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-semibold">No articles yet</p>
            <Link href="/writer/blogs/new" className="text-emerald-600 text-sm font-semibold hover:underline mt-2 inline-block">Write your first article →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Article</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Views</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {blogs.map(b => (
                  <tr key={b._id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={b.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1a2e5a] text-sm line-clamp-1">{b.title}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{b.excerpt?.slice(0, 60)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{b.category}</span></td>
                    <td className="px-5 py-4"><div className="flex items-center gap-1 text-sm text-slate-600"><Eye size={13} className="text-slate-400" /> {(b.views || 0).toLocaleString()}</div></td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${b.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{b.published ? 'Published' : 'Draft'}</span></td>
                    <td className="px-5 py-4 text-xs text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/blog/${b.slug}`} target="_blank" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Eye size={15} /></Link>
                        <Link href={`/writer/blogs/${b._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></Link>
                        <button onClick={() => handleDelete(b._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
