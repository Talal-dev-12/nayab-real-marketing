'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Phone, Mail } from 'lucide-react';
import { defaultAgents, getFromStorage, STORAGE_KEYS } from '@/lib/data';
import type { Agent } from '@/types';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const data = getFromStorage<Agent[]>(STORAGE_KEYS.AGENTS, defaultAgents);
    setAgents(data.filter(a => a.active));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-[#1a2e5a] py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Our Agents</h1>
        <p className="text-slate-400">Meet our expert real estate professionals</p>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-24 bg-gradient-to-r from-[#0f1e3d] to-[#1a2e5a]" />
              <div className="px-6 pb-6 -mt-12">
                <img src={agent.image} alt={agent.name} className="w-24 h-24 rounded-full border-4 border-white object-cover mb-3" />
                <h3 className="text-xl font-bold text-[#1a2e5a]">{agent.name}</h3>
                <p className="text-red-700 font-semibold text-sm mb-2">{agent.specialization}</p>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">{agent.bio}</p>
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="text-center">
                    <span className="text-2xl font-extrabold text-[#1a2e5a]">{agent.properties}</span>
                    <p className="text-xs text-slate-500">Properties Listed</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-red-700 transition-colors">
                    <Phone size={14} className="text-red-700" /> {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-red-700 transition-colors">
                    <Mail size={14} className="text-red-700" /> {agent.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
