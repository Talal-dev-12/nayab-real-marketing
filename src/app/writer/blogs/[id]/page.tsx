'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Eye, Plus, X, Image as ImageIcon, Loader2, Upload, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function WriterEditBlogPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [preview,      setPreview]      = useState(false);
  const [error,        setError]        = useState('');
  const [uploadingHero,setUploadingHero]= useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [tagInput,     setTagInput]     = useState('');
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '',
    image: '', images: ['','','',''] as string[],
    author: '', category: 'Real Estate', tags: [] as string[],
    published: false, metaTitle: '', metaDescription: '', metaKeywords: '',
    areaSlug: '', areaLabel: '', schemeSlug: '', schemeLabel: '',
  });

  const token = () => localStorage.getItem('writer_token') || '';

  useEffect(() => {
    fetch(`/api/blogs/${id}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(d => {
        const imgs = [...(d.images || [])]; while (imgs.length < 4) imgs.push('');
        setForm({ title: d.title || '', excerpt: d.excerpt || '', content: d.content || '', image: d.image || '', images: imgs.slice(0,4) as string[], author: d.author || '', category: d.category || 'Real Estate', tags: d.tags || [], published: !!d.published, metaTitle: d.metaTitle || '', metaDescription: d.metaDescription || '', metaKeywords: d.metaKeywords || '', areaSlug: d.areaSlug || '', areaLabel: d.areaLabel || '', schemeSlug: d.schemeSlug || '', schemeLabel: d.schemeLabel || '' });
      })
      .catch(() => setError('Failed to load article'))
      .finally(() => setLoading(false));
  }, [id]);

  const uploadImg = async (file: File): Promise<string> => {
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd });
    const d = await res.json(); if (!res.ok) throw new Error(d.error); return d.url;
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingHero(true);
    try { const url = await uploadImg(file); setForm(f => ({ ...f, image: url })); }
    catch (err: any) { setError(err.message); }
    finally { setUploadingHero(false); e.target.value = ''; }
  };

  const handleContentImage = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingIdx(idx);
    try { const url = await uploadImg(file); setForm(f => { const imgs = [...f.images]; imgs[idx] = url; return { ...f, images: imgs }; }); }
    catch (err: any) { setError(err.message); }
    finally { setUploadingIdx(null); e.target.value = ''; }
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.content || !form.excerpt) { setError('Title, excerpt and content are required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ ...form, images: form.images.filter(Boolean), published: publish ?? form.published }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || 'Failed to save'); return; }
      router.push('/writer/blogs');
    } catch (e: any) { setError(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const addTag = () => { if (tagInput.trim() && !form.tags.includes(tagInput.trim())) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(''); } };
  const rmTag  = (t: string) => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));

  if (loading) return <div className="text-center py-20 text-slate-400">Loading article…</div>;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/writer/blogs" className="p-2 rounded-lg hover:bg-white text-slate-500"><ArrowLeft size={20} /></Link>
          <div><h2 className="text-2xl font-extrabold text-[#1a2e5a]">Edit Article</h2><p className="text-slate-500 text-sm">{form.published ? 'Currently Published' : 'Currently Draft'}</p></div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-white"><Eye size={16} /> {preview ? 'Edit' : 'Preview'}</button>
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 border border-[#1a2e5a] text-[#1a2e5a] rounded-lg text-sm font-medium hover:bg-[#1a2e5a] hover:text-white disabled:opacity-50">Save Draft</button>
          <button onClick={() => handleSave(true)} disabled={saving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving…' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Article Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border-2 rounded-xl px-4 py-3 text-lg font-semibold outline-none focus:border-emerald-500" />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Excerpt *</label>
            <textarea rows={3} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 resize-none" />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Content *</label>
            {preview ? (
              <div className="prose prose-lg max-w-none min-h-[300px] border-2 rounded-xl p-4" dangerouslySetInnerHTML={{ __html: form.content }} />
            ) : (
              <textarea rows={16} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 resize-none font-mono" />
            )}
          </div>
          {/* Content Images */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><ImageIcon size={16} className="text-emerald-600" /><label className="text-xs font-semibold text-slate-500 uppercase">Content Images</label></div>
            <div className="grid grid-cols-2 gap-4">
              {[0,1,2,3].map(idx => (
                <div key={idx}>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Image {idx + 1}</label>
                  {form.images[idx] ? (
                    <div className="relative group">
                      <img src={form.images[idx]} alt="" className="w-full h-32 object-cover rounded-xl border-2" />
                      <button onClick={() => { const imgs = [...form.images]; imgs[idx] = ''; setForm(f => ({ ...f, images: imgs })); }} className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"><X size={12} /></button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 cursor-pointer h-20">
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleContentImage(e, idx)} />
                        {uploadingIdx === idx ? <Loader2 size={18} className="animate-spin text-emerald-600" /> : <Plus size={18} className="text-slate-400" />}
                      </label>
                      <input type="url" placeholder="or paste URL…" value={form.images[idx]} onChange={e => { const imgs = [...form.images]; imgs[idx] = e.target.value; setForm(f => ({ ...f, images: imgs })); }} className="w-full border rounded-lg px-2 py-1.5 text-xs outline-none" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-3 block">Cover Image</label>
            {form.image ? (
              <div className="relative group">
                <img src={form.image} alt="" className="w-full h-44 object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center gap-2">
                  <label className="bg-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} /> Replace</label>
                  <button onClick={() => setForm(f => ({ ...f, image: '' }))} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Remove</button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center border-2 border-dashed hover:border-emerald-400 rounded-xl p-6 cursor-pointer h-44 justify-center bg-slate-50">
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                {uploadingHero ? <Loader2 size={22} className="animate-spin text-emerald-600 mb-2" /> : <Upload size={22} className="text-slate-400 mb-2" />}
                <span className="text-xs text-slate-500">Upload cover</span>
              </label>
            )}
            <input type="url" placeholder="or paste URL…" value={form.image.startsWith('data:') ? '' : form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="mt-2 w-full border rounded-lg px-3 py-2 text-xs outline-none" />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-500">
                {['Real Estate','Buying Guide','Market Analysis','Investment','Property Tips','Rental Guide','Legal Advice'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Author</label>
              <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 space-y-3 border-l-4 border-blue-400">
            <div className="flex items-center gap-2"><MapPin size={15} className="text-blue-500" /><label className="text-xs font-bold text-slate-600 uppercase">Area & Scheme</label></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Area Name</label>
                <input type="text" value={form.areaLabel} onChange={e => setForm(f => ({ ...f, areaLabel: e.target.value, areaSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') }))} className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Housing Scheme</label>
                <input type="text" value={form.schemeLabel} onChange={e => setForm(f => ({ ...f, schemeLabel: e.target.value, schemeSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') }))} className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Tags</label>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Add tag…" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 border-2 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
              <button onClick={addTag} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(t => <span key={t} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">{t}<button onClick={() => rmTag(t)} className="ml-0.5 text-emerald-400 hover:text-emerald-700">×</button></span>)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-11 h-6 rounded-full transition-colors relative ${form.published ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{form.published ? 'Published (live)' : 'Draft (hidden)'}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
