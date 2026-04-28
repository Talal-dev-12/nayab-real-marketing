'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, Tag, Plus, X, Image as ImageIcon, Search, Loader2, Upload, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';
import { api, uploadImage } from '@/lib/api-client';
import type { ManagedArea, ManagedScheme } from '@/types';
import Select from '@/components/ui/Select';

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const insertFileRef = useRef<HTMLInputElement>(null);

  const [areas, setAreas] = useState<ManagedArea[]>([]);
  const [schemes, setSchemes] = useState<ManagedScheme[]>([]);
  const [loadingLocalities, setLoadingLocalities] = useState(true);

  // Fetch localities on mount
  useEffect(() => {
    Promise.all([
      api.get<{ areas: ManagedArea[] }>('/api/areas'),
      api.get<{ schemes: ManagedScheme[] }>('/api/schemes')
    ]).then(([areaData, schemeData]) => {
      setAreas(areaData.areas ?? []);
      setSchemes(schemeData.schemes ?? []);
    }).catch(console.error)
      .finally(() => setLoadingLocalities(false));
  }, []);

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '',
    image: '',
    author: 'Nayab Real Marketing',
    category: 'Real Estate',
    tags: [] as string[],
    published: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    areaSlug: '',
    areaLabel: '',
    schemeSlug: '',
    schemeLabel: '',
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

  // Insert an <img> tag at the current cursor position in the textarea
  const insertImageTag = (url: string, align: 'left' | 'center' | 'right' | 'full' = 'full') => {
    const ta = textareaRef.current;
    if (!ta) return;

    const styleMap = {
      left:   'float: left; margin: 0 1.5rem 1rem 0; max-width: 45%;',
      right:  'float: right; margin: 0 0 1rem 1.5rem; max-width: 45%;',
      center: 'display: block; margin: 1.5rem auto; max-width: 80%;',
      full:   'display: block; width: 100%; margin: 1.5rem 0;',
    };

    const tag = `\n<img src="${url}" alt="" style="${styleMap[align]} border-radius: 12px;" />\n`;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newContent = form.content.slice(0, start) + tag + form.content.slice(end);
    setForm(f => ({ ...f, content: newContent }));

    // Restore focus & move cursor after inserted tag
    setTimeout(() => {
      ta.focus();
      const pos = start + tag.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleInsertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInsertingImage(true); setError('');
    try {
      const url = await uploadImage(file);
      // Show alignment picker — default to full width for simplicity, user can tweak HTML
      insertImageTag(url, 'full');
    } catch (err: any) { setError(err.message || 'Image upload failed'); }
    finally { setInsertingImage(false); e.target.value = ''; }
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.content || !form.excerpt) { setError('Title, excerpt and content are required.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/api/blogs', {
        ...form,
        images: [],
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

            {/* Image insert toolbar */}
            {!preview && (
              <div className="flex items-center gap-2 mb-3 p-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl">
                <ImageIcon size={14} className="text-red-700 shrink-0" />
                <span className="text-xs font-semibold text-slate-500 mr-1">Insert image at cursor:</span>

                {/* Upload button */}
                <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${insertingImage ? 'bg-slate-200 text-slate-400' : 'bg-red-700 hover:bg-red-600 text-white'}`}>
                  <input ref={insertFileRef} type="file" accept="image/*" className="hidden" onChange={handleInsertUpload} disabled={insertingImage} />
                  {insertingImage ? <><Loader2 size={12} className="animate-spin" /> Uploading…</> : <><Upload size={12} /> Upload</>}
                </label>

                {/* Alignment quick-insert buttons */}
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-xs text-slate-400 mr-1">Align:</span>
                  {(['full', 'center', 'left', 'right'] as const).map(align => (
                    <button key={align} type="button"
                      onClick={() => {
                        const url = prompt('Paste image URL:');
                        if (url?.trim()) insertImageTag(url.trim(), align);
                      }}
                      className="px-2 py-1 text-xs bg-white border border-slate-200 hover:border-red-400 hover:text-red-700 rounded-lg transition-colors capitalize">
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {preview ? (
              <div className="prose prose-lg max-w-none min-h-[300px] border-2 rounded-xl p-4"
                dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-slate-400">Nothing to preview yet...</p>' }} />
            ) : (
              <textarea ref={textareaRef} rows={20}
                placeholder={`Write content here. HTML supported:\n<h2>Heading</h2>\n<p>Paragraph</p>\n<ul><li>Item</li></ul>\n\nImages are inserted inline using the toolbar above.`}
                value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 resize-none font-mono" />
            )}
            <p className="text-xs text-slate-400 mt-2">
              💡 Use the toolbar above to insert images directly into your content at any position. Uploaded images are automatically embedded as <code>&lt;img&gt;</code> tags.
            </p>
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
                <img src={form.image} alt="Cover" className="w-full h-44 object-cover rounded-xl" />
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
              <Select
                value={form.category}
                onChange={val => setForm(f => ({ ...f, category: val }))}
                className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                options={[
                  { value: 'Real Estate', label: 'Real Estate' },
                  { value: 'Buying Guide', label: 'Buying Guide' },
                  { value: 'Market Analysis', label: 'Market Analysis' },
                  { value: 'Investment', label: 'Investment' },
                  { value: 'Property Tips', label: 'Property Tips' },
                  { value: 'Rental Guide', label: 'Rental Guide' },
                  { value: 'Legal Advice', label: 'Legal Advice' },
                ]}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Author</label>
              <input type="text" className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
            </div>
          </div>

          {/* Area & Scheme Classification */}
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4 border-l-4 border-blue-400">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} className="text-blue-500" />
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Area & Scheme Classification</label>
              <span className="text-xs text-slate-400 font-normal">(for SEO pages)</span>
            </div>
            
            {loadingLocalities ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
                <Loader2 size={16} className="animate-spin" /> Loading localities...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Area</label>
                  <Select
                    value={form.areaSlug}
                    onChange={val => {
                      const selected = areas.find(a => a.slug === val);
                      if (selected) {
                        setForm(f => ({ ...f, areaSlug: selected.slug, areaLabel: selected.name }));
                      } else {
                        setForm(f => ({ ...f, areaSlug: '', areaLabel: '' }));
                      }
                    }}
                    className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-blue-400 bg-white"
                    placeholder="— No Area —"
                    options={[
                      { value: '', label: '— No Area —' },
                      ...areas.map(a => ({ value: a.slug, label: a.name }))
                    ]}
                  />
                  {form.areaSlug && <p className="text-xs text-slate-400 mt-1">URL: /blogs/areas/<strong>{form.areaSlug}</strong></p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Housing Scheme</label>
                  <Select
                    value={form.schemeSlug}
                    onChange={val => {
                      const selected = schemes.find(s => s.slug === val);
                      if (selected) {
                        const updates: any = { schemeSlug: selected.slug, schemeLabel: selected.name };
                        if (selected.areaId && !form.areaSlug) {
                           const parentArea = areas.find(a => a._id === selected.areaId);
                           if (parentArea) {
                             updates.areaSlug = parentArea.slug;
                             updates.areaLabel = parentArea.name;
                           }
                        }
                        setForm(f => ({ ...f, ...updates }));
                      } else {
                        setForm(f => ({ ...f, schemeSlug: '', schemeLabel: '' }));
                      }
                    }}
                    className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-blue-400 bg-white"
                    placeholder="— No Scheme —"
                    options={[
                      { value: '', label: '— No Scheme —' },
                      ...schemes.map(s => ({ value: s.slug, label: `${s.name} ${s.areaName ? `(${s.areaName})` : ''}` }))
                    ]}
                  />
                  {form.schemeSlug && <p className="text-xs text-slate-400 mt-1">URL: /blogs/schemes/<strong>{form.schemeSlug}</strong></p>}
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
              💡 Pages at <code>/blogs/areas/[area]</code> and <code>/blogs/schemes/[scheme]</code> generate automatically from these values — no extra setup needed. Manage areas and schemes from the <strong>Localities</strong> menu.
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

          {/* Image tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1.5">
            <p className="font-semibold text-amber-900 flex items-center gap-1.5"><ImageIcon size={13} /> Inline image placement</p>
            <p>Images are placed directly inside your content. Use the <strong>Insert image</strong> toolbar in the Content editor to upload or paste a URL, then pick an alignment (full, center, left wrap, right wrap).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
