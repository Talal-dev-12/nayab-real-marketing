'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Phone, Mail, Star, Building2, Search, Award } from 'lucide-react';
import type { Agent } from '@/types';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('all');

  useEffect(() => {
    fetch('/api/agents?active=true')
      .then(r => r.json()).then(data => setAgents(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  const specializations = ['all', ...Array.from(new Set(agents.map(a => a.specialization)))];
  const filtered = agents.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.specialization.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specialization === 'all' || a.specialization === specialization;
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] py-20 text-center relative overflow-hidden">
        <div className="relative">
          <span className="inline-block bg-red-700/20 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Our Team</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Meet Our Expert Agents</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Trusted real estate professionals with deep knowledge of Pakistan's property market</p>
          <div className="flex justify-center gap-12 mt-10">
            {[{ value: `${agents.length}+`, label: 'Expert Agents' }, { value: `${agents.reduce((s, a) => s + a.properties, 0)}+`, label: 'Properties Sold' }, { value: '10+', label: 'Years Experience' }].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <p className="text-slate-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 border-2 bg-white rounded-lg px-3 py-2 flex-1 max-w-xs focus-within:border-red-500 transition-colors">
            <Search size={16} className="text-red-600 shrink-0" />
            <input type="text" placeholder="Search agents..." className="outline-none text-sm w-full" onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {specializations.map(spec => (
              <button key={spec} onClick={() => setSpecialization(spec)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${specialization === spec ? 'bg-red-700 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
                {spec === 'all' ? 'All' : spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-16 max-w-7xl mx-auto px-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No agents found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(agent => (
              <div key={agent.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="h-28 bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] relative">
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-red-700/90 text-white px-2 py-1 rounded-full text-xs font-semibold"><Award size={10} /> Verified</div>
                  </div>
                  <img src={agent.image} alt={agent.name} className="absolute bottom-0 left-6 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg group-hover:scale-105 transition-transform" />
                </div>
                <div className="px-6 pb-6 pt-16">
                  <div className="flex justify-end mb-3">
                    <div>
                      <div className="flex text-amber-400 mb-1 justify-end">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
                      <p className="text-xs text-slate-400 text-right">5.0 Rating</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1a2e5a] mb-0.5">{agent.name}</h3>
                  <p className="text-red-700 font-semibold text-sm mb-3">{agent.specialization}</p>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{agent.bio}</p>
                  <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-3 mb-5">
                    <div className="text-center flex-1 border-r border-slate-200">
                      <div className="flex items-center justify-center gap-1 text-[#1a2e5a]"><Building2 size={14} /><span className="text-xl font-extrabold">{agent.properties}</span></div>
                      <p className="text-xs text-slate-500 mt-0.5">Properties</p>
                    </div>
                    <div className="text-center flex-1">
                      <span className="text-xl font-extrabold text-[#1a2e5a]">10+</span>
                      <p className="text-xs text-slate-500 mt-0.5">Yrs Exp.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-3 w-full bg-red-700 hover:bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-colors"><Phone size={15} /> {agent.phone}</a>
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"><Mail size={15} /> {agent.email}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}