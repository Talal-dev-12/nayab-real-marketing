'use client';
import { useState, useEffect } from 'react';
import {
  MapPin, Building2, Plus, Edit, Trash2, X, Upload, Loader2, Image as ImageIcon,
  GripVertical, ArrowUp, ArrowDown,
} from 'lucide-react';
import { api, uploadImage } from '@/lib/api-client';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import type { ManagedArea, ManagedScheme } from '@/types';

type Tab = 'areas' | 'schemes';

/* ─── Modal form state ───────────────────────────────────────────────────────── */
interface AreaForm { name: string; image: string; description: string; order: number; }
interface SchemeForm { name: string; logo: string; image: string; areaId: string; areaName: string; description: string; order: number; }

const emptyArea: AreaForm = { name: '', image: '', description: '', order: 0 };
const emptyScheme: SchemeForm = { name: '', logo: '', image: '', areaId: '', areaName: '', description: '', order: 0 };

export default function LocalitiesPage() {
  const [tab, setTab] = useState<Tab>('areas');

  /* ── Areas state ────────────────────────────────────────── */
  const [areas, setAreas] = useState<ManagedArea[]>([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areaModal, setAreaModal] = useState(false);
  const [editingArea, setEditingArea] = useState<ManagedArea | null>(null);
  const [areaForm, setAreaForm] = useState<AreaForm>(emptyArea);
  const [areaUploading, setAreaUploading] = useState(false);
  const [areaSaving, setAreaSaving] = useState(false);

  /* ── Schemes state ──────────────────────────────────────── */
  const [schemes, setSchemes] = useState<ManagedScheme[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [schemeModal, setSchemeModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState<ManagedScheme | null>(null);
  const [schemeForm, setSchemeForm] = useState<SchemeForm>(emptyScheme);
  const [logoUploading, setLogoUploading] = useState(false);
  const [schemeImageUploading, setSchemeImageUploading] = useState(false);
  const [schemeSaving, setSchemeSaving] = useState(false);

  const [error, setError] = useState('');

  /* ── Fetch ──────────────────────────────────────────────── */
  const fetchAreas = async () => {
    setAreasLoading(true);
    try {
      const data = await api.get<{ areas: ManagedArea[] }>('/api/areas');
      setAreas(data.areas ?? []);
    } catch { /* ignore */ }
    finally { setAreasLoading(false); }
  };

  const fetchSchemes = async () => {
    setSchemesLoading(true);
    try {
      const data = await api.get<{ schemes: ManagedScheme[] }>('/api/schemes');
      setSchemes(data.schemes ?? []);
    } catch { /* ignore */ }
    finally { setSchemesLoading(false); }
  };

  useEffect(() => { fetchAreas(); fetchSchemes(); }, []);

  /* ── Area CRUD ──────────────────────────────────────────── */
  const openAreaCreate = () => { setEditingArea(null); setAreaForm(emptyArea); setAreaModal(true); setError(''); };
  const openAreaEdit = (a: ManagedArea) => {
    setEditingArea(a);
    setAreaForm({ name: a.name, image: a.image, description: a.description, order: a.order });
    setAreaModal(true); setError('');
  };

  const saveArea = async () => {
    if (!areaForm.name.trim()) { setError('Area name is required'); return; }
    setAreaSaving(true); setError('');
    try {
      if (editingArea) {
        await api.put(`/api/areas/${editingArea._id}`, areaForm);
      } else {
        await api.post('/api/areas', areaForm);
      }
      setAreaModal(false);
      fetchAreas();
    } catch (e: any) { setError(e.message || 'Failed to save area'); }
    finally { setAreaSaving(false); }
  };

  const deleteArea = async (a: ManagedArea) => {
    if (!confirm(`Delete area "${a.name}"? This cannot be undone.`)) return;
    try { await api.delete(`/api/areas/${a._id}`); fetchAreas(); }
    catch (e: any) { alert(e.message || 'Delete failed'); }
  };

  const handleAreaImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setAreaUploading(true);
    try { const url = await uploadImage(file); setAreaForm(f => ({ ...f, image: url })); }
    catch (err: any) { setError(err.message || 'Upload failed'); }
    finally { setAreaUploading(false); e.target.value = ''; }
  };

  /* ── Scheme CRUD ────────────────────────────────────────── */
  const openSchemeCreate = () => { setEditingScheme(null); setSchemeForm(emptyScheme); setSchemeModal(true); setError(''); };
  const openSchemeEdit = (s: ManagedScheme) => {
    setEditingScheme(s);
    setSchemeForm({ name: s.name, logo: s.logo, image: s.image, areaId: s.areaId, areaName: s.areaName, description: s.description, order: s.order });
    setSchemeModal(true); setError('');
  };

  const saveScheme = async () => {
    if (!schemeForm.name.trim()) { setError('Scheme name is required'); return; }
    setSchemeSaving(true); setError('');
    try {
      if (editingScheme) {
        await api.put(`/api/schemes/${editingScheme._id}`, schemeForm);
      } else {
        await api.post('/api/schemes', schemeForm);
      }
      setSchemeModal(false);
      fetchSchemes();
    } catch (e: any) { setError(e.message || 'Failed to save scheme'); }
    finally { setSchemeSaving(false); }
  };

  const deleteScheme = async (s: ManagedScheme) => {
    if (!confirm(`Delete scheme "${s.name}"? This cannot be undone.`)) return;
    try { await api.delete(`/api/schemes/${s._id}`); fetchSchemes(); }
    catch (e: any) { alert(e.message || 'Delete failed'); }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setLogoUploading(true);
    try { const url = await uploadImage(file); setSchemeForm(f => ({ ...f, logo: url })); }
    catch (err: any) { setError(err.message || 'Upload failed'); }
    finally { setLogoUploading(false); e.target.value = ''; }
  };

  const handleSchemeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setSchemeImageUploading(true);
    try { const url = await uploadImage(file); setSchemeForm(f => ({ ...f, image: url })); }
    catch (err: any) { setError(err.message || 'Upload failed'); }
    finally { setSchemeImageUploading(false); e.target.value = ''; }
  };

  /* ── Reorder helpers ────────────────────────────────────── */
  const moveArea = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= areas.length) return;
    const a = areas[idx], b = areas[target];
    await Promise.all([
      api.put(`/api/areas/${a._id}`, { order: b.order }),
      api.put(`/api/areas/${b._id}`, { order: a.order }),
    ]);
    fetchAreas();
  };

  const moveScheme = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= schemes.length) return;
    const a = schemes[idx], b = schemes[target];
    await Promise.all([
      api.put(`/api/schemes/${a._id}`, { order: b.order }),
      api.put(`/api/schemes/${b._id}`, { order: a.order }),
    ]);
    fetchSchemes();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Localities</h2>
          <p className="text-slate-500 text-sm">Manage areas and housing schemes</p>
        </div>
        <button
          onClick={tab === 'areas' ? openAreaCreate : openSchemeCreate}
          className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2"
        >
          <Plus size={18} /> {tab === 'areas' ? 'Add Area' : 'Add Scheme'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button onClick={() => setTab('areas')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${tab === 'areas' ? 'text-red-700 border-b-2 border-red-700 bg-red-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <MapPin size={16} /> Areas <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{areas.length}</span>
          </button>
          <button onClick={() => setTab('schemes')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${tab === 'schemes' ? 'text-red-700 border-b-2 border-red-700 bg-red-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <Building2 size={16} /> Housing Schemes <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{schemes.length}</span>
          </button>
        </div>

        {/* ── Areas Table ──────────────────────────────────── */}
        {tab === 'areas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase w-10">Order</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Image</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Slug</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {areasLoading ? <TableRowSkeleton cols={5} rows={4} /> : areas.map((a, idx) => (
                  <tr key={a._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <button onClick={() => moveArea(idx, -1)} disabled={idx === 0} className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30"><ArrowUp size={12} /></button>
                        <span className="text-xs text-slate-400 font-mono">{a.order}</span>
                        <button onClick={() => moveArea(idx, 1)} disabled={idx === areas.length - 1} className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30"><ArrowDown size={12} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {a.image ? (
                        <img src={a.image} alt={a.name} className="w-16 h-10 rounded-lg object-cover bg-slate-200" />
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-slate-100 flex items-center justify-center"><ImageIcon size={14} className="text-slate-300" /></div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#1a2e5a]">{a.name}</td>
                    <td className="px-5 py-3 hidden md:table-cell text-slate-400 font-mono text-xs">{a.slug}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openAreaEdit(a)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Edit size={16} /></button>
                        <button onClick={() => deleteArea(a)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!areasLoading && areas.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <MapPin size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium">No areas yet</p>
                <p className="text-xs mt-1">Add your first area to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Schemes Table ────────────────────────────────── */}
        {tab === 'schemes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase w-10">Order</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Logo</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Area</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Slug</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemesLoading ? <TableRowSkeleton cols={6} rows={4} /> : schemes.map((s, idx) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <button onClick={() => moveScheme(idx, -1)} disabled={idx === 0} className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30"><ArrowUp size={12} /></button>
                        <span className="text-xs text-slate-400 font-mono">{s.order}</span>
                        <button onClick={() => moveScheme(idx, 1)} disabled={idx === schemes.length - 1} className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30"><ArrowDown size={12} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {s.logo ? (
                        <img src={s.logo} alt={s.name} className="w-12 h-12 rounded-lg object-contain bg-white border p-1" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center"><Building2 size={14} className="text-slate-300" /></div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#1a2e5a]">{s.name}</td>
                    <td className="px-5 py-3 hidden md:table-cell text-slate-500 text-xs">{s.areaName || '—'}</td>
                    <td className="px-5 py-3 hidden lg:table-cell text-slate-400 font-mono text-xs">{s.slug}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openSchemeEdit(s)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Edit size={16} /></button>
                        <button onClick={() => deleteScheme(s)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!schemesLoading && schemes.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <Building2 size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium">No housing schemes yet</p>
                <p className="text-xs mt-1">Add your first housing scheme to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
         AREA MODAL
         ═══════════════════════════════════════════════════════════════════════ */}
      {areaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-bold text-[#1a2e5a]">{editingArea ? 'Edit Area' : 'Add Area'}</h3>
              <button onClick={() => setAreaModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-lg text-sm border border-red-200">{error}</div>}

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Area Name *</label>
                <input type="text" placeholder="e.g. Clifton" value={areaForm.name}
                  onChange={e => setAreaForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" />
                {areaForm.name && (
                  <p className="text-xs text-slate-400 mt-1">Slug: <strong>{areaForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}</strong></p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Area Image</label>
                {areaForm.image ? (
                  <div className="relative group">
                    <img src={areaForm.image} alt="" className="w-full h-36 object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <label className="bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-100">
                        <input type="file" accept="image/*" className="hidden" onChange={handleAreaImage} /> Replace
                      </label>
                      <button onClick={() => setAreaForm(f => ({ ...f, image: '' }))} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Remove</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center border-2 border-dashed border-slate-200 hover:border-red-400 rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-red-50 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAreaImage} disabled={areaUploading} />
                    {areaUploading ? (
                      <><Loader2 size={22} className="animate-spin text-red-700 mb-2" /><span className="text-xs text-slate-500">Uploading...</span></>
                    ) : (
                      <><Upload size={22} className="text-slate-400 mb-2" /><span className="text-xs text-slate-500">Upload area image (drone shot recommended)</span></>
                    )}
                  </label>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Description (optional)</label>
                <textarea rows={2} placeholder="Brief description..." value={areaForm.description}
                  onChange={e => setAreaForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Display Order</label>
                <input type="number" value={areaForm.order}
                  onChange={e => setAreaForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="w-24 border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setAreaModal(false)} className="flex-1 border-2 border-slate-200 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button onClick={saveArea} disabled={areaSaving}
                  className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {areaSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editingArea ? 'Update Area' : 'Add Area'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
         SCHEME MODAL
         ═══════════════════════════════════════════════════════════════════════ */}
      {schemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-[#1a2e5a]">{editingScheme ? 'Edit Housing Scheme' : 'Add Housing Scheme'}</h3>
              <button onClick={() => setSchemeModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-lg text-sm border border-red-200">{error}</div>}

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Scheme Name *</label>
                <input type="text" placeholder="e.g. DHA Karachi" value={schemeForm.name}
                  onChange={e => setSchemeForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" />
                {schemeForm.name && (
                  <p className="text-xs text-slate-400 mt-1">Slug: <strong>{schemeForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}</strong></p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Official Logo</label>
                {schemeForm.logo ? (
                  <div className="relative group inline-block">
                    <img src={schemeForm.logo} alt="" className="h-20 w-auto object-contain rounded-xl border p-2 bg-white" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <label className="bg-white text-slate-700 px-2 py-1 rounded text-xs font-semibold cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} /> Replace
                      </label>
                      <button onClick={() => setSchemeForm(f => ({ ...f, logo: '' }))} className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">Remove</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center border-2 border-dashed border-slate-200 hover:border-red-400 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-red-50 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={logoUploading} />
                    {logoUploading ? (
                      <><Loader2 size={18} className="animate-spin text-red-700 mb-1" /><span className="text-xs text-slate-500">Uploading...</span></>
                    ) : (
                      <><Upload size={18} className="text-slate-400 mb-1" /><span className="text-xs text-slate-500">Upload scheme logo</span></>
                    )}
                  </label>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Banner Image (optional)</label>
                {schemeForm.image ? (
                  <div className="relative group">
                    <img src={schemeForm.image} alt="" className="w-full h-28 object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <label className="bg-white text-slate-700 px-2 py-1 rounded text-xs font-semibold cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleSchemeImage} /> Replace
                      </label>
                      <button onClick={() => setSchemeForm(f => ({ ...f, image: '' }))} className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">Remove</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center border-2 border-dashed border-slate-200 hover:border-red-400 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-red-50 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleSchemeImage} disabled={schemeImageUploading} />
                    {schemeImageUploading ? (
                      <><Loader2 size={18} className="animate-spin text-red-700 mb-1" /><span className="text-xs text-slate-500">Uploading...</span></>
                    ) : (
                      <><Upload size={18} className="text-slate-400 mb-1" /><span className="text-xs text-slate-500">Upload banner image</span></>
                    )}
                  </label>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Parent Area (optional)</label>
                <select value={schemeForm.areaId}
                  onChange={e => {
                    const selected = areas.find(a => a._id === e.target.value);
                    setSchemeForm(f => ({ ...f, areaId: e.target.value, areaName: selected?.name || '' }));
                  }}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500">
                  <option value="">— No area —</option>
                  {areas.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Description (optional)</label>
                <textarea rows={2} placeholder="Brief description..." value={schemeForm.description}
                  onChange={e => setSchemeForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Display Order</label>
                <input type="number" value={schemeForm.order}
                  onChange={e => setSchemeForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="w-24 border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setSchemeModal(false)} className="flex-1 border-2 border-slate-200 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button onClick={saveScheme} disabled={schemeSaving}
                  className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {schemeSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editingScheme ? 'Update Scheme' : 'Add Scheme'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
