'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, Tag, Plus, X, Image as ImageIcon, Search, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import { api, uploadImage } from '@/lib/api-client';
import Image from 'next/image';

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '',
    image: '',
    images: ['', '', '', ''] as string[],
    author: 'Nayab Real Marketing',
    category: 'Real Estate',
    tags: [] as string[],
    published: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [tagInput, setTagInput] = useState('');

  const getMetaTitle = () => form.metaTitle || form.title;
  const getMetaDesc = () => form.metaDescription || form.excerpt.slice(0, 160);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true); setError('');
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, image: url }));
    } catch (err: any) { setError(err.message || 'Cover image upload failed'); }
    finally { setUploadingHero(false); e.target.value = ''; }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx); setError('');
    try {
      const url = await uploadImage(file);
      setForm(f => { const imgs = [...f.images]; imgs[idx] = url; return { ...f, images: imgs }; });
    } catch (err: any) { setError(err.message || `Image ${idx + 1} upload failed`); }
    finally { setUploadingIdx(null); e.target.value = ''; }
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.content || !form.excerpt) { setError('Title, excerpt and content are required.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/api/blogs', {
        ...form,
        images: form.images.filter(Boolean),
        published: publish ?? form.published,
        metaTitle: getMetaTitle(),
        metaDescription: getMetaDesc(),
      });
      router.push('/admin/blogs');
    } catch (e: any) { setError(e.message || 'Failed to save blog'); } finally { setSaving(false); }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-2 rounded-lg hover:bg-white text-slate-500"><ArrowLeft size={20} /></Link>
          <div>
            <h2 className="text-2xl font-extrabold text-[#1a2e5a]">New Blog Post</h2>
            <p className="text-slate-500 text-sm">Create and publish a new article</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-white transition-colors">
            <Eye size={16} /> {preview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 border border-[#1a2e5a] text-[#1a2e5a] rounded-lg text-sm font-medium hover:bg-[#1a2e5a] hover:text-white transition-colors disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving || !form.title} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            <Save size={16} /> {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Blog Title *</label>
            <input type="text" placeholder="Enter a compelling blog title..." value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border-2 rounded-xl px-4 py-3 text-lg font-semibold outline-none focus:border-red-500 transition-colors" />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Excerpt / Summary *</label>
            <textarea rows={3} placeholder="Write a brief summary shown in blog listings..." value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors resize-none" />
            <p className="text-xs text-slate-400 mt-1">{form.excerpt.length}/300 characters</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Content (HTML supported) *</label>
            {preview ? (
              <div className="prose prose-lg max-w-none min-h-[300px] border-2 rounded-xl p-4"
                dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-slate-400">Nothing to preview yet...</p>' }} />
            ) : (
              <textarea rows={16} placeholder={`Write content here. HTML supported:\n<h2>Heading</h2>\n<p>Paragraph</p>\n<ul><li>Item</li></ul>`}
                value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 resize-none font-mono" />
            )}
          </div>

          {/* Content Images */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={16} className="text-red-700" />
              <label className="text-xs font-semibold text-slate-500 uppercase">Content Images (up to 4)</label>
            </div>
            <p className="text-xs text-slate-400 mb-4">These appear in the article photo gallery below the content.</p>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx}>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Image {idx + 1}</label>
                  {form.images[idx] ? (
                    <div className="relative group">
                      <Image rel="preload" src={form.images[idx]} alt="" className="w-full h-32 object-cover rounded-xl border-2 border-slate-200" />
                      <button onClick={() => { const imgs = [...form.images]; imgs[idx] = ''; setForm(f => ({ ...f, images: imgs })); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-red-400 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-red-50 transition-colors h-20">
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleContentImageUpload(e, idx)} disabled={uploadingIdx !== null} />
                        {uploadingIdx === idx ? (
                          <Loader2 size={18} className="animate-spin text-red-700" />
                        ) : (
                          <><Plus size={18} className="text-slate-400 mb-1" /><span className="text-xs text-slate-400">Upload</span></>
                        )}
                      </label>
                      <input type="url" placeholder="or paste URL..." value={form.images[idx]}
                        onChange={e => { const imgs = [...form.images]; imgs[idx] = e.target.value; setForm(f => ({ ...f, images: imgs })); }}
                        className="w-full border rounded-lg px-2 py-1.5 text-xs outline-none focus:border-red-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search size={16} className="text-red-700" />
              <label className="text-xs font-semibold text-slate-500 uppercase">SEO Settings</label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Meta Title <span className="text-slate-400 font-normal normal-case">(defaults to blog title)</span></label>
                <input type="text" maxLength={60} placeholder={form.title || 'Meta title...'} value={form.metaTitle}
                  onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" />
                <p className="text-xs text-slate-400 mt-1">{getMetaTitle().length}/60 chars</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Meta Description <span className="text-slate-400 font-normal normal-case">(defaults to excerpt)</span></label>
                <textarea rows={3} maxLength={160} placeholder={form.excerpt.slice(0, 160) || 'Meta description...'} value={form.metaDescription}
                  onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none" />
                <p className="text-xs text-slate-400 mt-1">{getMetaDesc().length}/160 chars</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Meta Keywords</label>
                <input type="text" placeholder="real estate karachi, property pakistan..." value={form.metaKeywords}
                  onChange={e => setForm(f => ({ ...f, metaKeywords: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" />
              </div>
              {/* SERP Preview */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Google Preview</label>
                <div className="border rounded-xl p-4 bg-slate-50">
                  <p className="text-blue-700 text-base font-medium line-clamp-1">{getMetaTitle() || 'Blog Post Title'}</p>
                  <p className="text-green-700 text-xs mt-0.5">nayabrealestate.com › blog › {(form.title || 'slug').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}</p>
                  <p className="text-slate-600 text-sm mt-1 line-clamp-2">{getMetaDesc() || 'Meta description will appear here...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover Image */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-3 block">Cover Image</label>
            {form.image ? (
              <div className="relative group">
                <Image rel="preload" src={form.image} alt="Cover" className="w-full h-44 object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                  <label className="bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-100">
                    <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                    Replace
                  </label>
                  <button onClick={() => setForm(f => ({ ...f, image: '' }))} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Remove</button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center border-2 border-dashed border-slate-200 hover:border-red-400 rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-red-50 transition-colors h-44 justify-center">
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} disabled={uploadingHero} />
                {uploadingHero ? (
                  <><Loader2 size={22} className="animate-spin text-red-700 mb-2" /><span className="text-xs text-slate-500">Uploading...</span></>
                ) : (
                  <><Upload size={22} className="text-slate-400 mb-2" /><span className="text-xs text-slate-500">Upload cover image</span></>
                )}
              </label>
            )}
            <input type="url" placeholder="or paste image URL..." value={form.image.startsWith('data:') ? '' : form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              className="mt-2 w-full border rounded-lg px-3 py-2 text-xs outline-none focus:border-red-500" />
          </div>

          {/* Category & Author */}
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Category</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option>Real Estate</option><option>Buying Guide</option><option>Market Analysis</option>
                <option>Investment</option><option>Property Tips</option><option>Rental Guide</option><option>Legal Advice</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Author</label>
              <input type="text" className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Tags</label>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 border-2 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500" />
              <button onClick={addTag} className="bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <span key={tag} className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  {tag}<button onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-700 ml-0.5">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Summary */}
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 mb-2">Image Summary</p>
            <p>Cover: {form.image ? '✅ Set' : '⬜ Not set'}</p>
            {[0, 1, 2, 3].map(i => <p key={i}>Image {i + 1}: {form.images[i] ? '✅ Set' : '⬜ Empty'}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}