'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, CheckCheck, Trash2 } from 'lucide-react';
import { api } from '@/lib/api-client';

interface Msg { _id: string; name: string; email: string; phone: string; subject: string; message: string; read: boolean; createdAt: string; }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [selected, setSelected] = useState<Msg | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Msg[]>('/api/contact').then(d => setMessages(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markRead = async (msg: Msg) => {
    if (msg.read) return;
    await api.put(`/api/messages/${msg._id}`, { read: true });
    setMessages(ms => ms.map(m => m._id === msg._id ? { ...m, read: true } : m));
  };

  const deleteMsg = async (msg: Msg) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/api/messages/${msg._id}`);
    setMessages(ms => ms.filter(m => m._id !== msg._id));
    if (selected?._id === msg._id) setSelected(null);
  };

  const selectMsg = (msg: Msg) => { setSelected(msg); markRead(msg); };
  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-extrabold text-[#1a2e5a]">Messages</h2><p className="text-slate-500 text-sm">{unread} unread, {messages.length} total</p></div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex h-[calc(100vh-250px)] min-h-[500px]">
        <div className="w-full md:w-80 border-r overflow-y-auto shrink-0">
          {loading ? <div className="text-center py-12 text-slate-400">Loading...</div> :
           messages.length === 0 ? <div className="text-center py-12 text-slate-400"><MessageSquare size={40} className="mx-auto mb-3 opacity-30" /><p>No messages yet</p></div> :
           messages.map(msg => (
            <div key={msg._id} onClick={() => selectMsg(msg)}
              className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${selected?._id === msg._id ? 'bg-red-50 border-l-4 border-l-red-700' : ''} ${!msg.read ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">{msg.name[0]}</div>
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${!msg.read ? 'font-bold text-[#1a2e5a]' : 'font-medium text-slate-700'}`}>{msg.name}</p>
                    <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                  </div>
                </div>
                {!msg.read && <span className="w-2.5 h-2.5 bg-red-600 rounded-full mt-1 shrink-0" />}
              </div>
              <p className="text-xs text-slate-400 mt-2 line-clamp-1 ml-11">{msg.message}</p>
              <p className="text-xs text-slate-300 mt-1 ml-11">{new Date(msg.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {selected ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <div><h3 className="text-xl font-bold text-[#1a2e5a]">{selected.subject}</h3><p className="text-sm text-slate-500">{new Date(selected.createdAt).toLocaleString()}</p></div>
              <div className="flex gap-2">
                <button onClick={() => markRead(selected)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600" title="Mark as read"><CheckCheck size={18} /></button>
                <button onClick={() => deleteMsg(selected)} className="p-2 rounded-lg hover:bg-red-50 text-red-600" title="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white font-bold">{selected.name[0]}</div>
                <div><p className="text-xs text-slate-500">Name</p><p className="font-semibold text-[#1a2e5a]">{selected.name}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><Mail size={18} className="text-red-700" /></div>
                <div><p className="text-xs text-slate-500">Email</p><a href={`mailto:${selected.email}`} className="font-semibold text-red-700 hover:underline text-sm">{selected.email}</a></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Phone size={18} className="text-green-700" /></div>
                <div><p className="text-xs text-slate-500">Phone</p><a href={`tel:${selected.phone}`} className="font-semibold text-green-700 hover:underline text-sm">{selected.phone}</a></div>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-5"><p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p></div>
            <div className="mt-4">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm"><Mail size={16} /> Reply via Email</a>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3"><MessageSquare size={48} className="opacity-20" /><p>Select a message to read</p></div>
        )}
      </div>
    </div>
  );
}