'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Mail, Heart, Send, MapPin, Bed, Bath, Maximize,
  Edit2, Save, X, LogOut, ChevronRight, ExternalLink, Clock, Home,
} from 'lucide-react';
import type { Property, Inquiry, UserProfile } from '@/types';
import { profileApi, savedApi, inquiriesApi, api } from '@/lib/api-client';

type Tab = 'my_properties' | 'saved' | 'inquiries' | 'settings';

function formatPrice(price: number, type: string, period?: string) {
  const f = price >= 10000000
    ? `${(price / 10000000).toFixed(1)} Cr`
    : price >= 100000
      ? `${(price / 100000).toFixed(0)} Lac`
      : price.toLocaleString();
  return `PKR ${f}${type === 'rent' ? `/${period || 'mo'}` : ''}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile,    setProfile]    = useState<UserProfile | null>(null);
  const [saved,      setSaved]      = useState<Property[]>([]);
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [inquiries,  setInquiries]  = useState<Inquiry[]>([]);
  const [tab,        setTab]        = useState<Tab>('saved');
  const [loading,    setLoading]    = useState(true);
  const [editing,    setEditing]    = useState(false);
  const [editName,   setEditName]   = useState('');
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token') ?? localStorage.getItem('admin_token');
    if (!token) { router.push('/sign-in?redirect=/profile'); return; }

    let storedUserId = '';
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    if (raw) {
      try { storedUserId = JSON.parse(raw).id; } catch {}
    }

    Promise.all([
      profileApi.get(),
      savedApi.list(),
      inquiriesApi.myList(),
      api.get(`/api/properties?submittedBy=${storedUserId}&dashboard=true&limit=50`).catch(() => ({ properties: [] }))
    ])
      .then(([prof, sv, inqs, myPropsRes]) => {
        const u = (prof as any).user as UserProfile;
        setProfile(u);
        setEditName(u.name);
        setSaved((sv as any).savedProperties as Property[] ?? []);
        setInquiries(Array.isArray(inqs) ? inqs as Inquiry[] : []);
        setMyProperties((myPropsRes as any).properties || []);
        if (u.role === 'seller' || u.role === 'agent' || u.role === 'manager' || u.role === 'superadmin') {
          setTab('my_properties');
        }
      })
      .catch(() => router.push('/sign-in?redirect=/profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (propertyId: string) => {
    await savedApi.toggle(propertyId);
    setSaved(s => s.filter(p => (p as any)._id !== propertyId));
  };

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    setSaving(true); setError('');
    try {
      const res = await profileApi.update({ name: editName.trim() });
      setProfile(prev => prev ? { ...prev, name: (res as any).user.name } : prev);
      // Update localStorage
      const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
      if (raw) {
        const u = JSON.parse(raw);
        u.name = (res as any).user.name;
        localStorage.setItem('auth_user', JSON.stringify(u));
      }
      setEditing(false);
    } catch (e: any) { setError(e.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
    ['auth_token','auth_user','admin_token','admin_user'].forEach(k => localStorage.removeItem(k));
    router.push('/');
  };

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-slate-400 text-sm">Loading profile…</div>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-red-700">Home</Link>
          <ChevronRight size={14} />
          <span className="text-[#1a2e5a] font-medium">My Profile</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar: user card ────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-5">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-red-100 mb-3" />
                ) : (
                  <div className="w-20 h-20 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                    {initials}
                  </div>
                )}
                {editing ? (
                  <div className="w-full space-y-2">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 text-center"
                    />
                    {error && <p className="text-red-600 text-xs">{error}</p>}
                    <div className="flex gap-2">
                      <button onClick={handleSaveName} disabled={saving}
                        className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-60">
                        <Save size={12} /> {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button onClick={() => { setEditing(false); setEditName(profile.name); }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-extrabold text-[#1a2e5a] text-lg">{profile.name}</h2>
                    <button onClick={() => setEditing(true)}
                      className="mt-1 text-xs text-slate-400 hover:text-red-700 flex items-center gap-1 transition-colors">
                      <Edit2 size={11} /> Edit name
                    </button>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={14} className="text-red-600 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User size={14} className="text-red-600 shrink-0" />
                  <span className="capitalize">{profile.role}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={12} className="shrink-0" />
                  <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-red-700">{saved.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Saved</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-blue-700">{inquiries.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Inquiries</p>
                </div>
              </div>

              <button onClick={handleLogout}
                className="flex items-center gap-2 w-full justify-center text-sm text-slate-500 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors font-medium">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>

          {/* ── Main content ─────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b">
                {([
                  ...(profile.role === 'seller' || profile.role === 'agent' || profile.role === 'manager' || profile.role === 'superadmin' ? [{ key: 'my_properties', label: 'My Listed Properties', icon: Home, count: myProperties.length }] : []),
                  { key: 'saved',     label: 'Saved Properties', icon: Heart,  count: saved.length     },
                  { key: 'inquiries', label: 'My Inquiries',      icon: Send,   count: inquiries.length },
                ] as { key: Tab; label: string; icon: any; count: number }[]).map(({ key, label, icon: Icon, count }) => (
                  <button key={key} onClick={() => setTab(key)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors ${tab === key ? 'text-red-700 border-b-2 border-red-700 bg-red-50/40' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Icon size={15} />
                    {label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab === key ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* ── My Properties tab ─────────────────────────────── */}
              {tab === 'my_properties' && (
                <div className="p-5">
                  {myProperties.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <Home size={44} className="mx-auto mb-3 text-slate-200" />
                      <p className="font-semibold text-slate-500">You haven't listed any properties yet</p>
                      <Link href="/dashboard/properties/new"
                        className="mt-3 inline-block text-sm text-red-700 font-semibold hover:underline">
                        Add New Property →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myProperties.map(p => (
                        <div key={p._id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
                          <div>
                            <div className="relative h-36 overflow-hidden">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'}
                                alt={p.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 left-2 flex gap-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white ${p.priceType === 'sale' ? 'bg-red-700' : 'bg-blue-600'}`}>
                                  For {p.priceType === 'sale' ? 'Sale' : 'Rent'}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  p.approvalStatus === 'approved' ? 'bg-emerald-500 text-white' :
                                  p.approvalStatus === 'rejected' ? 'bg-red-500 text-white' :
                                  'bg-amber-500 text-white'
                                }`}>
                                  {p.approvalStatus || 'pending'}
                                </span>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-bold text-[#1a2e5a] text-sm line-clamp-1 group-hover:text-red-700 transition-colors">{p.title}</h3>
                              <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                <MapPin size={10} className="text-red-500 shrink-0" />{p.location}
                              </p>
                              {p.approvalStatus === 'rejected' && p.rejectionNote && (
                                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded line-clamp-2">
                                  <strong>Reason:</strong> {p.rejectionNote}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="p-3 pt-0 flex justify-between items-end border-t mt-3 border-slate-100 pt-3">
                            <p className="font-extrabold text-red-700 text-sm">{formatPrice(p.price, p.priceType, p.rentPeriod)}</p>
                            <Link href={`/dashboard/properties/${p._id}/edit`}
                              className="text-xs bg-slate-100 hover:bg-red-700 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors">
                              <Edit2 size={10} /> Edit
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Saved Properties tab ─────────────────────────────── */}
              {tab === 'saved' && (
                <div className="p-5">
                  {saved.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <Heart size={44} className="mx-auto mb-3 text-slate-200" />
                      <p className="font-semibold text-slate-500">No saved properties yet</p>
                      <Link href="/properties"
                        className="mt-3 inline-block text-sm text-red-700 font-semibold hover:underline">
                        Browse Properties →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {saved.map(p => (
                        <div key={(p as any)._id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                          <div className="relative h-36 overflow-hidden">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${p.priceType === 'sale' ? 'bg-red-700' : 'bg-blue-600'}`}>
                                For {p.priceType === 'sale' ? 'Sale' : 'Rent'}
                              </span>
                            </div>
                            <button onClick={() => handleUnsave((p as any)._id)}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                              title="Remove from saved">
                              <Heart size={13} fill="white" />
                            </button>
                          </div>
                          <div className="p-3">
                            <h3 className="font-bold text-[#1a2e5a] text-sm line-clamp-1 group-hover:text-red-700 transition-colors">{p.title}</h3>
                            <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                              <MapPin size={10} className="text-red-500 shrink-0" />{p.location}
                            </p>
                            {p.bedrooms > 0 && (
                              <div className="flex gap-3 text-xs text-slate-400 mt-2">
                                <span className="flex items-center gap-1"><Bed size={10} className="text-red-500" /> {p.bedrooms}</span>
                                <span className="flex items-center gap-1"><Bath size={10} className="text-red-500" /> {p.bathrooms}</span>
                                <span className="flex items-center gap-1"><Maximize size={10} className="text-red-500" /> {p.area}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <p className="font-extrabold text-red-700 text-sm">{formatPrice(p.price, p.priceType, p.rentPeriod)}</p>
                              <Link href={`/properties/${p.slug}`}
                                className="text-xs bg-[#1a2e5a] hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors">
                                View <ExternalLink size={10} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Inquiries tab ─────────────────────────────────────── */}
              {tab === 'inquiries' && (
                <div className="p-5">
                  {inquiries.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <Send size={44} className="mx-auto mb-3 text-slate-200" />
                      <p className="font-semibold text-slate-500">No inquiries sent yet</p>
                      <Link href="/properties"
                        className="mt-3 inline-block text-sm text-red-700 font-semibold hover:underline">
                        Browse Properties →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map(inq => (
                        <div key={inq._id} className="border rounded-xl p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <Link href={`/properties/${inq.propertySlug}`}
                                className="font-bold text-[#1a2e5a] text-sm hover:text-red-700 transition-colors flex items-center gap-1">
                                {inq.propertyTitle} <ExternalLink size={11} />
                              </Link>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {new Date(inq.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${inq.read ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {inq.read ? 'Seen' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2 bg-slate-50 rounded-lg p-3 italic">
                            "{inq.message}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Browse CTA */}
            <div className="bg-gradient-to-r from-[#1a2e5a] to-[#0f1e3d] rounded-2xl p-6 text-white flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Find Your Dream Property</p>
                <p className="text-slate-300 text-sm mt-1">Browse hundreds of verified listings across Pakistan</p>
              </div>
              <Link href="/properties"
                className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
                Browse Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
