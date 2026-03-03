'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { defaultProperties, getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/data';

export default function NewPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '', priceType: 'sale', rentPeriod: 'month',
    location: '', city: 'Karachi', area: '', bedrooms: '', bathrooms: '',
    type: 'residential', status: 'available', featured: false,
  });
  const [images, setImages] = useState<string[]>(['']);

  const handleSave = () => {
    if (!form.title || !form.price) return alert('Please fill in required fields');
    setSaving(true);
    const properties = getFromStorage(STORAGE_KEYS.PROPERTIES, defaultProperties);
    const newProp = {
      id: Date.now().toString(),
      ...form,
      price: Number(form.price),
      area: Number(form.area),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      images: images.filter(Boolean),
      agentId: '1',
      createdAt: new Date().toISOString(),
      views: 0,
    };
    saveToStorage(STORAGE_KEYS.PROPERTIES, [newProp, ...properties]);
    setTimeout(() => {
      setSaving(false);
      router.push('/admin/properties');
    }, 600);
  };

  const F = ({ label, ...props }: any) => (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">{label}</label>
      <input className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" {...props} />
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/properties" className="p-2 rounded-lg hover:bg-white text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Add New Property</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Property'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Basic Information</h3>
            <F label="Property Title *" placeholder="e.g. 5 Marla House in DHA Phase 6" value={form.title} onChange={(e: any) => setForm(f => ({ ...f, title: e.target.value }))} />
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Description</label>
              <textarea rows={4} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none"
                placeholder="Describe the property in detail..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <F label="Location / Address *" placeholder="e.g. DHA Phase 6, Karachi" value={form.location} onChange={(e: any) => setForm(f => ({ ...f, location: e.target.value }))} />
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">City</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                <option>Karachi</option><option>Lahore</option><option>Islamabad</option><option>Rawalpindi</option><option>Faisalabad</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Property Type</label>
                <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                  <option value="plot">Plot</option>
                </select>
              </div>
              <F label="Area (sqft)" type="number" placeholder="1125" value={form.area} onChange={(e: any) => setForm(f => ({ ...f, area: e.target.value }))} />
              {form.type !== 'plot' && (
                <>
                  <F label="Bedrooms" type="number" placeholder="3" value={form.bedrooms} onChange={(e: any) => setForm(f => ({ ...f, bedrooms: e.target.value }))} />
                  <F label="Bathrooms" type="number" placeholder="2" value={form.bathrooms} onChange={(e: any) => setForm(f => ({ ...f, bathrooms: e.target.value }))} />
                </>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Property Images</h3>

            {/* Device Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Upload from Device</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-red-400 rounded-xl p-6 cursor-pointer transition-colors bg-slate-50 hover:bg-red-50 group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        setImages(prev => {
                          const filtered = prev.filter(Boolean);
                          return [...filtered, ev.target?.result as string];
                        });
                      };
                      reader.readAsDataURL(file);
                    });
                    e.target.value = '';
                  }}
                />
                <div className="w-12 h-12 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <Plus size={24} className="text-red-700" />
                </div>
                <p className="font-semibold text-slate-600 text-sm">Click to upload images</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP supported. Multiple files allowed.</p>
              </label>
            </div>

            {/* URL Input */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Or Add Image URLs</label>
              {images.filter(img => !img.startsWith('data:')).map((img, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    className="flex-1 border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                    placeholder="https://images.unsplash.com/..."
                    value={img}
                    onChange={e => {
                      const allImages = [...images];
                      const urlOnlyIdx = images.findIndex((im, idx) => !im.startsWith('data:') && images.filter((m, j) => !m.startsWith('data:') && j < idx).length === i);
                      if (urlOnlyIdx !== -1) {
                        allImages[urlOnlyIdx] = e.target.value;
                        setImages(allImages);
                      }
                    }}
                  />
                  {img && <img src={img} className="w-12 h-10 rounded object-cover" onError={e => (e.currentTarget.style.display = 'none')} alt="" />}
                  <button onClick={() => setImages(images.filter(im => im !== img))} className="p-2 text-red-500 hover:bg-red-50 rounded">
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button onClick={() => setImages([...images, ''])} className="flex items-center gap-2 text-red-700 font-semibold text-sm hover:underline mt-1">
                <Plus size={16} /> Add URL
              </button>
            </div>

            {/* Preview Grid */}
            {images.filter(Boolean).length > 0 && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Image Preview ({images.filter(Boolean).length})</label>
                <div className="grid grid-cols-3 gap-2">
                  {images.filter(Boolean).map((img, i) => (
                    <div key={i} className="relative group aspect-video">
                      <img src={img} className="w-full h-full object-cover rounded-lg" alt={`Preview ${i + 1}`} onError={e => (e.currentTarget.parentElement!.style.display = 'none')} />
                      <button
                        onClick={() => setImages(images.filter((_, j) => j !== images.indexOf(img)))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"
                      >
                        <X size={12} />
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 bg-red-700 text-white text-xs px-1.5 py-0.5 rounded font-semibold">Main</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Pricing</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Listing Type</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.priceType} onChange={e => setForm(f => ({ ...f, priceType: e.target.value }))}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <F label="Price (PKR) *" type="number" placeholder="25000000" value={form.price} onChange={(e: any) => setForm(f => ({ ...f, price: e.target.value }))} />
            {form.priceType === 'rent' && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Rent Period</label>
                <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.rentPeriod} onChange={e => setForm(f => ({ ...f, rentPeriod: e.target.value }))}>
                  <option value="month">Per Month</option>
                  <option value="year">Per Year</option>
                </select>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Status</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Property Status</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-5 h-5 accent-red-700"
              />
              <span className="text-sm font-semibold text-slate-700">Mark as Featured Property</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
