'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Loader2, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { api, uploadImage } from '@/lib/api-client';
import { can } from '@/lib/rbac';
import { AREA_UNITS, toSqft, fromSqft, formatArea } from '@/lib/areaUtils';
import type { UserRole } from '@/lib/jwt';
import type { AreaUnit } from '@/lib/areaUtils';
import Select from '@/components/ui/Select';

const AMENITIES = ['Electricity', 'Gas', 'Water Supply', 'Security', 'Park', 'Mosque', 'Gym', 'Swimming Pool', 'Elevator', 'Car Parking', 'Backup Generator', 'High Speed Internet'];
const KARACHI_AREAS = ['DHA (Defence Housing Authority)', 'Bahria Town Karachi', 'Clifton', 'Gulshan-e-Iqbal', 'Gulistan-e-Jauhar', 'North Nazimabad', 'Malir', 'Scheme 33', 'Korangi', 'PECHS', 'Tariq Road', 'F.B Area', 'Nazimabad', 'Saddar', 'Other'];function F({ label, ...props }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">{label}</label>
      <input className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" {...props} />
    </div>
  );
}

function useCurrentUser() {
  const [user, setUser] = useState<{ id: string; role: UserRole } | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    if (raw) try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  return user;
}

const APPROVAL_BADGE: Record<string, { label: string; cls: string; icon: any }> = {
  pending:  { label: 'Pending Review', cls: 'bg-amber-100 text-amber-700',  icon: Clock        },
  approved: { label: 'Approved',       cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  rejected: { label: 'Rejected',       cls: 'bg-red-100 text-red-700',      icon: XCircle      },
};

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }      = use(params);
  const router      = useRouter();
  const currentUser = useCurrentUser();

  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching,  setFetching]  = useState(true);
  const [error,     setError]     = useState('');
  const [agents,    setAgents]    = useState<any[]>([]);
  const [images,    setImages]    = useState<string[]>([]);
  const [urlInput,  setUrlInput]  = useState('');
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '', priceType: 'sale', rentPeriod: 'month',
    location: '', city: 'Karachi', areaScheme: '', areaValue: '', areaUnit: 'sqft' as AreaUnit,
    bedrooms: '', bathrooms: '',
    type: 'residential', status: 'available', featured: false, agentId: '',
    approvalStatus: 'pending',
    amenities: [] as string[],
  });

  const toggleAmenity = (amenity: string) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(amenity) ? f.amenities.filter(a => a !== amenity) : [...f.amenities, amenity]
    }));
  };

  useEffect(() => {
    if (!id) return;
    api.get<any>(`/api/properties/${id}`)
      .then(p => {
        // Display area in original unit if known, else sqft
        const unit = (p.areaUnit as AreaUnit) || 'sqft';
        const displayVal = fromSqft(p.area || 0, unit);
        setForm({
          title:          p.title       || '',
          description:    p.description || '',
          price:          String(p.price || ''),
          priceType:      p.priceType   || 'sale',
          rentPeriod:     p.rentPeriod  || 'month',
          location:       p.location    || '',
          city:           p.city        || 'Karachi',
          areaScheme:     p.areaScheme  || '',
          areaValue:      String(parseFloat(displayVal.toFixed(4))),
          areaUnit:       unit,
          bedrooms:       String(p.bedrooms  || ''),
          bathrooms:      String(p.bathrooms || ''),
          type:           p.type        || 'residential',
          status:         p.status      || 'available',
          featured:       p.featured    || false,
          agentId:        p.agentId     || '',
          approvalStatus: p.approvalStatus || 'approved',
          amenities:      p.amenities   || [],
        });
        setImages(p.images || []);
        setRejectionNote(p.rejectionNote || '');
      })
      .catch(() => setError('Could not load property.'))
      .finally(() => setFetching(false));
  }, [id]);

  useEffect(() => {
    if (currentUser && can(currentUser.role, 'assignAgent')) {
      api.get<any[]>('/api/agents?active=true').then(d => setAgents(Array.isArray(d) ? d : [])).catch(() => {});
    }
  }, [currentUser]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true); setError('');
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f)));
      setImages(prev => [...prev, ...urls]);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally { setUploading(false); e.target.value = ''; }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (url) { setImages(prev => [...prev, url]); setUrlInput(''); }
  };

  const handleSave = async (overrides?: Record<string, any>) => {
    if (!form.title || !form.price || !form.location || !form.areaValue) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true); setError('');
    try {
      const areaInSqft = toSqft(Number(form.areaValue), form.areaUnit);
      await api.put(`/api/properties/${id}`, {
        ...form,
        ...overrides,
        area:      areaInSqft,
        areaUnit:  form.areaUnit,
        price:     Number(form.price),
        bedrooms:  Number(form.bedrooms)  || 0,
        bathrooms: Number(form.bathrooms) || 0,
        images,
      });
      router.push('/dashboard/properties');
    } catch (e: any) {
      setError(e.message || 'Failed to save property');
    } finally { setSaving(false); }
  };

  const handleApprove = () => handleSave({ approvalStatus: 'approved', rejectionNote: '' });

  const handleReject = async () => {
    if (!rejectionNote.trim()) { setError('Please enter a rejection reason.'); return; }
    setShowRejectModal(false);
    await handleSave({ approvalStatus: 'rejected', rejectionNote });
  };

  if (!currentUser) return null;
  const role         = currentUser.role;
  const isSeller     = role === 'seller';
  const isAdmin      = can(role, 'manageAllProperties');
  const needsBedBath = form.type !== 'plot' && form.type !== 'shop';
  const badge        = APPROVAL_BADGE[form.approvalStatus] || APPROVAL_BADGE.pending;
  const BadgeIcon    = badge.icon;

  if (fetching) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={28} className="animate-spin text-red-700" />
    </div>
  );

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/properties" className="p-2 rounded-lg hover:bg-white text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Edit Property</h2>
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${badge.cls}`}>
              <BadgeIcon size={12} /> {badge.label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && form.approvalStatus === 'pending' && (
            <>
              <button onClick={handleApprove} disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors">
                <CheckCircle size={16} /> Approve
              </button>
              <button onClick={() => setShowRejectModal(true)} disabled={saving}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors">
                <XCircle size={16} /> Reject
              </button>
            </>
          )}
          {isAdmin && form.approvalStatus === 'approved' && (
            <button onClick={() => setShowRejectModal(true)} disabled={saving}
              className="flex items-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors">
              <XCircle size={16} /> Revoke Approval
            </button>
          )}
          {isAdmin && form.approvalStatus === 'rejected' && (
            <button onClick={handleApprove} disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors">
              <CheckCircle size={16} /> Approve Now
            </button>
          )}
          <button onClick={() => handleSave()} disabled={saving || uploading}
            className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Rejection note (visible to seller when rejected) */}
      {form.approvalStatus === 'rejected' && rejectionNote && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800">
          <strong>Admin note:</strong> {rejectionNote}
          {isSeller && <p className="mt-1 text-red-700">Please fix the issues above and save to resubmit.</p>}
        </div>
      )}

      {isSeller && form.approvalStatus === 'pending' && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          Your listing is awaiting admin review. You can still edit it — changes will keep it in review.
        </div>
      )}

      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Basic Information</h3>
            <F label="Property Title *" placeholder="e.g. 5 Marla House in DHA Phase 6"
              value={form.title} onChange={(e: any) => setForm(f => ({ ...f, title: e.target.value }))} />
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Description</label>
              <textarea rows={4} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none"
                placeholder="Describe the property..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">City</label>
              <Select
                value={form.city}
                onChange={val => setForm(f => ({ ...f, city: val, areaScheme: val === 'Karachi' ? f.areaScheme : '' }))}
                className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                options={[
                  { value: 'Karachi', label: 'Karachi' },
                  { value: 'Lahore', label: 'Lahore' },
                  { value: 'Islamabad', label: 'Islamabad' },
                  { value: 'Rawalpindi', label: 'Rawalpindi' },
                  { value: 'Faisalabad', label: 'Faisalabad' },
                ]}
              />
            </div>
            {form.city === 'Karachi' && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Area / Housing Scheme</label>
                <Select
                  value={form.areaScheme}
                  onChange={val => setForm(f => ({ ...f, areaScheme: val }))}
                  className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                  placeholder="-- Select Area --"
                  options={[
                    { value: '', label: '-- Select Area --' },
                    ...KARACHI_AREAS.map(a => ({ value: a, label: a }))
                  ]}
                />
              </div>
            )}
            <F label="Precise Location / Address *" placeholder={form.city === 'Karachi' ? "e.g. Street 5, House 10" : "e.g. DHA Phase 6, Karachi"}
              value={form.location} onChange={(e: any) => setForm(f => ({ ...f, location: e.target.value }))} />
            {can(role, 'assignAgent') && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Assign Agent</label>
                <Select
                  value={form.agentId}
                  onChange={val => setForm(f => ({ ...f, agentId: val }))}
                  className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                  placeholder="-- Select Agent --"
                  options={[
                    { value: '', label: '-- Select Agent --' },
                    ...agents.map(a => ({ value: a._id, label: a.name }))
                  ]}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Property Type</label>
                <Select
                  value={form.type}
                  onChange={val => setForm(f => ({ ...f, type: val }))}
                  className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                  options={[
                    { value: 'residential', label: 'Residential' },
                    { value: 'commercial', label: 'Commercial' },
                    { value: 'office', label: 'Office' },
                    { value: 'plot', label: 'Plot' },
                    { value: 'shop', label: 'Shop' },
                  ]}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Area *</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="e.g. 5"
                    className="flex-1 border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                    value={form.areaValue} onChange={e => setForm(f => ({ ...f, areaValue: e.target.value }))} />
                  <div className="w-[100px]">
                    <Select
                      value={form.areaUnit}
                      onChange={val => setForm(f => ({ ...f, areaUnit: val as AreaUnit }))}
                      className="border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                      options={AREA_UNITS.map(u => ({ value: u.value, label: u.abbr }))}
                    />
                  </div>
                </div>
                {form.areaValue && (
                  <p className="text-xs text-slate-400 mt-1">
                    = {toSqft(Number(form.areaValue), form.areaUnit).toFixed(0)} sqft
                  </p>
                )}
              </div>
              {needsBedBath && (
                <>
                  <F label="Bedrooms" type="number" placeholder="3"
                    value={form.bedrooms} onChange={(e: any) => setForm(f => ({ ...f, bedrooms: e.target.value }))} />
                  <F label="Bathrooms" type="number" placeholder="2"
                    value={form.bathrooms} onChange={(e: any) => setForm(f => ({ ...f, bathrooms: e.target.value }))} />
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES.map(amenity => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input type="checkbox" checked={form.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)} className="w-4 h-4 accent-red-700" />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Property Images</h3>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-red-400 bg-slate-50 hover:bg-red-50 rounded-xl p-6 cursor-pointer transition-colors">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
              {uploading
                ? <><Loader2 size={24} className="text-red-700 animate-spin mb-2" /><p className="text-sm text-slate-500">Uploading...</p></>
                : <><Upload size={24} className="text-slate-400 mb-2" /><p className="font-semibold text-slate-600 text-sm">Click to upload images</p><p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP</p></>
              }
            </label>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Or Add Image URL</label>
              <div className="flex gap-2">
                <input type="url" className="flex-1 border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  placeholder="https://..." value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())} />
                <button onClick={addUrl} className="bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600">Add</button>
              </div>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-video">
                    <img src={img} className="w-full h-full object-cover rounded-lg" alt=""
                      onError={e => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')} />
                    <button onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <X size={12} />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 bg-red-700 text-white text-xs px-1.5 py-0.5 rounded font-semibold">Main</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Pricing</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Listing Type</label>
              <Select
                value={form.priceType}
                onChange={val => setForm(f => ({ ...f, priceType: val }))}
                className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                options={[
                  { value: 'sale', label: 'For Sale' },
                  { value: 'rent', label: 'For Rent' },
                ]}
              />
            </div>
            <F label="Price (PKR) *" type="number" placeholder="25000000"
              value={form.price} onChange={(e: any) => setForm(f => ({ ...f, price: e.target.value }))} />
            {form.priceType === 'rent' && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Rent Period</label>
                <Select
                  value={form.rentPeriod}
                  onChange={val => setForm(f => ({ ...f, rentPeriod: val }))}
                  className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                  options={[
                    { value: 'month', label: 'Per Month' },
                    { value: 'year', label: 'Per Year' },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Status</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Property Status</label>
              <Select
                value={form.status}
                onChange={val => setForm(f => ({ ...f, status: val }))}
                className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'sold', label: 'Sold' },
                  { value: 'rented', label: 'Rented' },
                ]}
              />
            </div>
            {can(role, 'markFeatured') && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-5 h-5 accent-red-700" />
                <span className="text-sm font-semibold text-slate-700">Mark as Featured</span>
              </label>
            )}
          </div>

          {/* Area conversions reference */}
          {form.areaValue && (
            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-slate-700 mb-2">Area Conversions</p>
              {(['sqft','sqyd','marla','kanal'] as AreaUnit[]).map(u => (
                <p key={u} className={u === form.areaUnit ? 'font-bold text-red-700' : ''}>
                  {formatArea(toSqft(Number(form.areaValue), form.areaUnit), u)}
                </p>
              ))}
            </div>
          )}

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">Images: {images.length} uploaded</p>
            <p>First image will be used as the main cover.</p>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-[#1a2e5a] text-lg mb-2">Reject Listing</h3>
            <p className="text-slate-500 text-sm mb-4">
              Provide a reason so the seller knows what to fix. They will receive this by email.
            </p>
            <textarea rows={4} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none"
              placeholder="e.g. Images are too dark. Please upload clearer photos and provide a more detailed description."
              value={rejectionNote} onChange={e => setRejectionNote(e.target.value)} />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg border text-slate-600 text-sm font-semibold hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleReject} disabled={saving}
                className="px-4 py-2 rounded-lg bg-red-700 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
                {saving ? 'Sending...' : 'Reject & Notify Seller'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
