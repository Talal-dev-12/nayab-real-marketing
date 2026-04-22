'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, Mail, Phone, CheckCheck, Trash2, ExternalLink, Search, ChevronLeft } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Inquiry } from '@/types';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected,  setSelected]  = useState<Inquiry | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    api.get<Inquiry[]>('/api/inquiries')
      .then(d => setInquiries(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (inq: Inquiry) => {
    if (inq.read) return;
    await api.put(`/api/inquiries/${inq._id}`, { read: true });
    setInquiries(qs => qs.map(q => q._id === inq._id ? { ...q, read: true } : q));
    if (selected?._id === inq._id) setSelected({ ...inq, read: true });
  };

  const deleteInq = async (inq: Inquiry) => {
    if (!confirm('Delete this inquiry?')) return;
    await api.delete(`/api/inquiries/${inq._id}`);
    setInquiries(qs => qs.filter(q => q._id !== inq._id));
    if (selected?._id === inq._id) setSelected(null);
  };

  const selectInq = (inq: Inquiry) => { setSelected(inq); markRead(inq); };

  const filtered = inquiries.filter(q =>
    !search ||
    q.userName.toLowerCase().includes(search.toLowerCase()) ||
    q.propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
    q.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const unread = inquiries.filter(q => !q.read).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Property Inquiries</h2>
          <p className="text-slate-500 text-sm">{unread} unread · {inquiries.length} total</p>
        </div>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white w-full sm:max-w-xs">
          <Search size={14} className="text-slate-400" />
          <input type="text" placeholder="Search..." className="outline-none text-sm flex-1 min-w-0"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex h-[calc(100vh-250px)] min-h-[500px]">
        {/* List panel */}
        <div className={`w-full md:w-80 border-r overflow-y-auto shrink-0 ${selected ? 'hidden md:block' : 'block'}`}>
          {loading ? (
            <div className="divide-y">{Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Send size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">{search ? 'No results' : 'No inquiries yet'}</p>
            </div>
          ) : filtered.map(inq => (
            <div key={inq._id} onClick={() => selectInq(inq)}
              className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${selected?._id === inq._id ? 'bg-red-50 border-l-4 border-l-red-700' : ''} ${!inq.read ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {inq.userName[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${!inq.read ? 'font-bold text-[#1a2e5a]' : 'font-medium text-slate-700'}`}>
                      {inq.userName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{inq.propertyTitle}</p>
                  </div>
                </div>
                {!inq.read && <span className="w-2.5 h-2.5 bg-red-600 rounded-full mt-1 shrink-0" />}
              </div>
              <p className="text-xs text-slate-400 mt-2 line-clamp-1 ml-11">{inq.message}</p>
              <p className="text-xs text-slate-300 mt-1 ml-11">{new Date(inq.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-2 items-start">
                <button className="md:hidden p-1 -ml-1 text-slate-400 hover:bg-slate-100 rounded-lg shrink-0 mt-0.5" onClick={() => setSelected(null)}>
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1a2e5a]">Inquiry: {selected.propertyTitle}</h3>
                  <p className="text-sm text-slate-500">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => markRead(selected)} title="Mark read"
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"><CheckCheck size={18} /></button>
                <button onClick={() => deleteInq(selected)} title="Delete"
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={18} /></button>
              </div>
            </div>

            {/* User info */}
            <div className="bg-slate-50 rounded-xl p-4 mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {selected.userName[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="font-semibold text-[#1a2e5a] text-sm">{selected.userName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-red-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a href={`mailto:${selected.userEmail}`} className="font-semibold text-red-700 hover:underline text-sm">{selected.userEmail}</a>
                </div>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <a href={`tel:${selected.phone}`} className="font-semibold text-green-700 hover:underline text-sm">{selected.phone}</a>
                  </div>
                </div>
              )}
            </div>

            {/* Property link */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600 font-semibold uppercase">Property</p>
                <p className="font-bold text-[#1a2e5a]">{selected.propertyTitle}</p>
              </div>
              <Link href={`/properties/${selected.propertySlug}`} target="_blank"
                className="flex items-center gap-1 text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                View <ExternalLink size={12} />
              </Link>
            </div>

            {/* Message */}
            <div className="bg-white border rounded-xl p-5 mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Message</p>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            {/* Reply */}
            <a href={`mailto:${selected.userEmail}?subject=Re: Your inquiry about ${selected.propertyTitle}`}
              className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              <Mail size={16} /> Reply via Email
            </a>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3">
            <Send size={48} className="opacity-20" />
            <p className="text-sm">Select an inquiry to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
