'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { defaultAgents, getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/data';
import type { Agent } from '@/types';

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    setAgents(getFromStorage(STORAGE_KEYS.AGENTS, defaultAgents));
  }, []);

  const deleteAgent = (id: string) => {
    if (!confirm('Delete this agent?')) return;
    const updated = agents.filter(a => a.id !== id);
    setAgents(updated);
    saveToStorage(STORAGE_KEYS.AGENTS, updated);
  };

  const toggleActive = (id: string) => {
    const updated = agents.map(a => a.id === id ? { ...a, active: !a.active } : a);
    setAgents(updated);
    saveToStorage(STORAGE_KEYS.AGENTS, updated);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Agents</h2>
          <p className="text-slate-500 text-sm">{agents.filter(a => a.active).length} active agents</p>
        </div>
        <Link href="/admin/agents/new" className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2">
          <Plus size={18} /> Add Agent
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#0f1e3d] to-[#1a2e5a] relative">
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${agent.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {agent.active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="px-5 pt-0 pb-5 -mt-12">
              <img src={agent.image} alt={agent.name} className="w-20 h-20 rounded-full border-4 border-white object-cover mb-3" />
              <h3 className="font-bold text-[#1a2e5a] text-lg">{agent.name}</h3>
              <p className="text-red-700 text-sm font-semibold mb-2">{agent.specialization}</p>
              <p className="text-slate-500 text-xs mb-4 line-clamp-2">{agent.bio}</p>
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone size={12} className="text-red-700" /> {agent.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail size={12} className="text-red-700" /> {agent.email}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-slate-500">{agent.properties} Properties</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(agent.id)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${agent.active ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                  >
                    {agent.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => deleteAgent(agent.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
