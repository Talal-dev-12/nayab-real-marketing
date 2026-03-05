'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, Tag } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', image: '', author: 'Nayab Real Marketing', category: 'Real Estate', tags: [] as string[], published: false });
  const [tagInput, setTagInput] = useState('');

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.content || !form.excerpt) { setError('Title, excerpt and content are required.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/api/blogs', { ...form, published: publish ?? form.published });
      router.push('/admin/blogs');
    } catch (e: any) { setError(e.message || 'Failed to save blog'); } finally { setSaving(false); }
  };

  const addTag = () => { if (tagInput.trim()) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(''); } };
  const removeTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-2 rounded-lg hover:bg-white text-slate-500"><ArrowLeft size={20} /></Link>
          <div><h2 className="text-2xl font-extrabold text-[#1a2e5a]">New Blog Post</h2><p className="text-slate-500 text-sm">Create and publish a new article</p></div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-white"><Eye size={16} /> {preview ? 'Edit' : 'Preview'}</button>
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 border border-[#1a2e5a] text-[#1a2e5a] rounded-lg text-sm font-medium hover:bg-[#1a2e5a] hover:text-white transition-colors">Save Draft</button>
          <button onClick={() => handleSave(true)} disabled={saving || !form.title} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            <Save size={16} /> {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Blog Title *</label>
            <input type="text" placeholder="Enter a compelling blog title..." className="w-full border-2 rounded-xl px-4 py-3 text-lg font-semibold outline-none focus:border-red-500"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Excerpt / Summary</label>
            <textarea rows={3} placeholder="Brief summary..." className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 resize-none"
              value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Content (HTML supported)</label>
            {preview ? (
              <div className="prose min-h-[300px] max-w-none border-2 rounded-xl p-4" dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-slate-400">Nothing to preview yet...</p>' }} />
            ) : (
              <textarea rows={16} placeholder="Write your blog content here. HTML tags are supported..." className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 resize-none font-mono"
                value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Featured Image URL</label>
            <input type="url" placeholder="https://images.unsplash.com/..." className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
              value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
            {form.image && <img src={form.image} alt="" className="mt-3 w-full h-36 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Category</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option>Real Estate</option><option>Buying Guide</option><option>Market Analysis</option><option>Investment</option><option>Property Tips</option><option>Rental Guide</option><option>Legal Advice</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Author</label>
              <input type="text" className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Tag size={14} /> Tags</label>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Add tag..." className="flex-1 border-2 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500"
                value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} />
              <button onClick={addTag} className="bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <span key={tag} className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  {tag}<button onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-700">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}