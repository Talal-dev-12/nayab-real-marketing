'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, FileText, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

const APPROVAL_BADGE: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700'     },
  approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700'         },
};

export default function DashboardBlogs() {
  const currentUser = useCurrentUser();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 8;

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [reviewBlog, setReviewBlog] = useState<any | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const fetchBlogs = async () => {
    if (!currentUser) return;
    setLoading(true);

    let url = `/api/blogs?dashboard=true&page=${page}&limit=${limit}`;
    
    if (currentUser.role === 'writer') {
      url += `&authorId=${currentUser.id}`;
    }

    if (activeTab !== 'all') {
      url += `&approvalStatus=${activeTab}`;
    }

    try {
      const data = await api.get<any>(url);
      setBlogs(data.blogs ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentUser, page, activeTab]);

  const togglePublish = async (blog: any) => {
    try {
      const updated = await api.put<any>(`/api/blogs/${blog._id}`, { published: !blog.published });
      setBlogs(bs => bs.map(b => b._id === updated._id ? updated : b));
    } catch (e: any) {
      alert(e.message || 'Update failed');
    }
  };

  const deleteBlog = async (blog: any) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/api/blogs/${blog._id}`);
      fetchBlogs(); // re-fetch to keep the table full at 8 rows
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!reviewBlog) return;
    if (status === 'rejected' && !rejectionNote.trim()) {
      alert('A rejection reason is required.');
      return;
    }
    try {
      const payload: any = { 
        approvalStatus: status,
        rejectionNote: status === 'rejected' ? rejectionNote : ''
      };
      if (status === 'approved') payload.published = true; // Auto publish upon approval
      
      const updated = await api.put<any>(`/api/blogs/${reviewBlog._id}`, payload);
      setBlogs(bs => bs.map(x => x._id === updated._id ? updated : x));
      setReviewBlog(null);
      setRejectionNote('');
    } catch (e: any) {
      alert(e.message || 'Update failed');
    }
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (!currentUser) return null;
  const role       = currentUser.role;
  const canPublish = can(role, 'publishAnyBlog') || role === 'writer'; // wait, writer can publish? Only if approved.
  const canDelete  = can(role, 'manageAllBlogs') || role === 'writer';
  const isWriter   = role === 'writer';
  const canManage  = can(role, 'manageAllBlogs');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">{isWriter ? 'My Articles' : 'Blog Posts'}</h2>
          <p className="text-slate-500 text-sm">{total} total posts</p>
        </div>
        <Link href="/dashboard/blogs/new"
          className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2">
          <Plus size={18} /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm text-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg self-start">
            {['all', 'pending', 'approved', 'rejected'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`px-4 py-1.5 rounded-md font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#1a2e5a]' : 'text-slate-500 hover:text-[#1a2e5a]'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5 shrink-0 min-w-0 md:max-w-sm w-full md:w-auto">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search blogs..." className="outline-none text-sm flex-1 min-w-0"
              onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Author</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Visibility</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Views</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <TableRowSkeleton cols={6} rows={8} /> : filtered.map(b => {
                const ab = APPROVAL_BADGE[b.approvalStatus || 'pending'] || APPROVAL_BADGE.pending;
                return (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {b.image ? (
                          <img src={b.image} className="w-12 h-10 rounded-lg object-cover hidden sm:block bg-slate-200" alt="" />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-slate-200 hidden sm:flex items-center justify-center shrink-0">
                            <FileText size={16} className="text-slate-400"/>
                          </div>
                        )}
                        <p className="font-semibold text-[#1a2e5a] line-clamp-1 max-w-[200px]">{b.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-slate-600 font-medium">
                      {b.author}
                    </td>
                    <td className="px-5 py-4">
                      {b.approvalStatus === 'pending' && canManage ? (
                        <button onClick={() => setReviewBlog(b)} className="px-3 py-1 text-[10px] uppercase font-bold bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors">
                          Review Request
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${ab.cls}`}>{ab.label}</span>
                          {b.approvalStatus === 'rejected' && b.rejectionNote && isWriter && (
                             <span className="text-xs text-red-600 truncate max-w-[120px]" title={b.rejectionNote}>Reason: {b.rejectionNote}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {b.published ? (
                        <span className="px-2 py-1 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700">Published</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-[10px] uppercase font-bold bg-slate-100 text-slate-500">Draft</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-slate-500">{b.views}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/dashboard/blogs/${b._id}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Edit size={16} /></Link>
                        {/* Managers/superadmins can always toggle; writers only if approved */}
                        {((canPublish && !isWriter) || (isWriter && b.approvalStatus === 'approved')) && (
                          <button onClick={() => togglePublish(b)}
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold transition-colors flex items-center gap-1 ${
                              b.published
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                            title={b.published ? 'Unpublish this blog' : 'Publish this blog'}
                          >
                            {b.published ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => deleteBlog(b)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <FileText size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium">No blog posts found</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-5 py-4 border-t bg-slate-50">
          <p className="text-xs text-slate-500">Showing page {page} of {pages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded bg-white border shadow-sm disabled:opacity-50 hover:bg-slate-50">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-1 rounded bg-white border shadow-sm disabled:opacity-50 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-bold text-[#1a2e5a]">Review Article</h3>
              <button onClick={() => { setReviewBlog(null); setRejectionNote(''); }} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"><XCircle size={20}/></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 mb-4">You are reviewing <strong>{reviewBlog.title}</strong> submitted for approval.</p>
              
              <div className="mb-5">
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Rejection Note (Optional for Approval)</label>
                <textarea 
                  className="w-full border-2 rounded-lg p-3 text-sm focus:border-red-500 min-h-[80px]" 
                  placeholder="If rejecting, explain why here..."
                  value={rejectionNote}
                  onChange={e => setRejectionNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleReview('approved')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold">
                  <CheckCircle size={18}/> Approve
                </button>
                <button onClick={() => handleReview('rejected')} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold">
                  <XCircle size={18}/> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
