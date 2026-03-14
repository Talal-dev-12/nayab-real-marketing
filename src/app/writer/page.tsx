'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Eye, TrendingUp, Plus, BarChart3 } from 'lucide-react';

export default function WriterDashboard() {
  const [blogs,   setBlogs]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('writer_token');
    const user  = JSON.parse(localStorage.getItem('writer_user') || '{}');
    fetch('/api/blogs?limit=200', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setBlogs((d.blogs ?? []).filter((b: any) => b.authorId === user.id)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total      = blogs.length;
  const published  = blogs.filter(b => b.published).length;
  const totalViews = blogs.reduce((s, b) => s + (b.views || 0), 0);
  const avgViews   = total ? Math.round(totalViews / total) : 0;

  const stats = [
    { label: 'My Articles',   value: total,      icon: FileText,   color: 'bg-blue-50 text-blue-700'     },
    { label: 'Published',     value: published,  icon: TrendingUp, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Views',   value: totalViews, icon: Eye,        color: 'bg-purple-50 text-purple-700'  },
    { label: 'Avg Views',     value: avgViews,   icon: BarChart3,  color: 'bg-amber-50 text-amber-700'   },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-extrabold text-[#1a2e5a]">My Dashboard</h2><p className="text-slate-500 text-sm">Track your articles and performance</p></div>
        <Link href="/writer/blogs/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}><Icon size={20} /></div>
            <div className="text-2xl font-extrabold text-[#1a2e5a]">{loading ? '—' : value.toLocaleString()}</div>
            <div className="text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Top articles by views */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-extrabold text-[#1a2e5a]">My Articles</h3>
          <Link href="/writer/blogs" className="text-sm text-emerald-600 font-semibold hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="font-semibold text-slate-500">No articles yet</p>
            <Link href="/writer/blogs/new" className="text-emerald-600 text-sm font-semibold hover:underline mt-2 inline-block">Write your first article</Link>
          </div>
        ) : (
          <div className="divide-y">
            {[...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8).map(b => (
              <div key={b._id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                <img src={b.image} alt={b.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a2e5a] line-clamp-1">{b.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{b.category} · {new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 mr-2"><Eye size={13} /> {b.views?.toLocaleString()}</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${b.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{b.published ? 'Live' : 'Draft'}</span>
                <Link href={`/writer/blogs/${b._id}`} className="text-xs text-emerald-600 font-semibold hover:underline ml-2">Edit</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
