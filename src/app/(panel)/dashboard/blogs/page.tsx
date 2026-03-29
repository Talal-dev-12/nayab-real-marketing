'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, FileText } from 'lucide-react';
import { api } from '@/lib/api-client';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { can } from '@/lib/rbac';
import type { Blog } from '@/types';
import type { UserRole } from '@/lib/jwt';

function useCurrentUser() {
  const [user, setUser] = useState<{ id: string; role: UserRole } | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    if (raw) try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  return user;
}

export default function DashboardBlogs() {
  const currentUser = useCurrentUser();
  const [blogs,   setBlogs]   = useState<Blog[]>([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Writers only see their own; admins see all
    const url = can(currentUser.role, 'manageAllBlogs')
      ? '/api/blogs?limit=200'
      : `/api/blogs?authorId=${currentUser.id}&limit=200`;

    api.get<any>(url)
      .then(d => setBlogs(d.blogs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser]);

  const togglePublish = async (blog: Blog) => {
    const updated = await api.put<Blog>(`/api/blogs/${(blog as any)._id}`, { published: !blog.published });
    setBlogs(bs => bs.map(b => (b as any)._id === (updated as any)._id ? updated : b));
  };

  const deleteBlog = async (blog: Blog) => {
    if (!confirm('Delete this blog post?')) return;
    await api.delete(`/api/blogs/${(blog as any)._id}`);
    setBlogs(bs => bs.filter(b => (b as any)._id !== (blog as any)._id));
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (!currentUser) return null;
  const role       = currentUser.role;
  const canPublish = can(role, 'publishAnyBlog') || role === 'writer'; // writers can toggle their own
  const canDelete  = can(role, 'manageAllBlogs') || role === 'writer';
  const isWriter   = role === 'writer';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">{isWriter ? 'My Articles' : 'Blog Posts'}</h2>
          <p className="text-slate-500 text-sm">{blogs.length} total posts</p>
        </div>
        <Link href="/dashboard/blogs/new"
          className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2">
          <Plus size={18} /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 max-w-sm">
          <Search size={16} className="text-slate-400" />
          <input type="text" placeholder="Search blogs..." className="outline-none text-sm flex-1"
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Author</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Views</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <TableRowSkeleton cols={6} rows={8} /> : filtered.map(b => (
              <tr key={(b as any)._id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {b.image && <img src={b.image} className="w-12 h-10 rounded-lg object-cover hidden sm:block" alt="" />}
                    <p className="font-semibold text-[#1a2e5a] line-clamp-1 max-w-xs">{b.title}</p>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-slate-600">{b.author}</td>
                <td className="px-5 py-4 hidden lg:table-cell"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">{b.category}</span></td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-slate-500">{b.views}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/blogs/${(b as any)._id}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Edit size={16} /></Link>
                    {canPublish && (
                      <button onClick={() => togglePublish(b)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title={b.published ? 'Unpublish' : 'Publish'}>
                        {b.published ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => deleteBlog(b)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FileText size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No blog posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
