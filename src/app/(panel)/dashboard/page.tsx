'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Home, FileText, Users, MessageSquare, TrendingUp, ArrowUpRight, Plus, Send, MailWarning, Clock, CheckCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { can } from '@/lib/rbac';
import type { UserRole } from '@/lib/jwt';

// ── Hook: read current user from localStorage (already verified by layout) ───
function useCurrentUser() {
  const [user, setUser] = useState<{ id: string; name: string; role: UserRole; emailVerified?: boolean } | null>(null);
  useEffect(() => {
    let parsed: any = null;
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    if (raw) try { parsed = JSON.parse(raw); } catch { /* ignore */ }
    
    // Safely extract ID from JWT if it is missing in the localStorage object
    const token = localStorage.getItem('auth_token') ?? localStorage.getItem('admin_token');
    if (token && parsed && !parsed.id && !parsed._id) {
      try {
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr);
        if (payload.id) parsed.id = payload.id;
      } catch { /* ignore */ }
    }
    
    setUser(parsed);
  }, []);
  return user;
}

// ─────────────────────────────────────────────────────────────────────────────
// SELLER dashboard — shows only their own submitted properties
// ─────────────────────────────────────────────────────────────────────────────
function SellerDashboard({ userId, emailVerified }: { userId: string; emailVerified?: boolean }) {
  const [properties, setProperties] = useState<any[]>([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    api.get<any>(`/api/properties?dashboard=true&submittedBy=${userId}&limit=200`)
      .then(d => setProperties(d.properties ?? []))
      .catch(() => {});
  }, [userId]);

  const available = properties.filter(p => p.status === 'available').length;
  const sold      = properties.filter(p => p.status === 'sold').length;
  const pending   = properties.filter(p => p.approvalStatus === 'pending').length;
  const rejected  = properties.filter(p => p.approvalStatus === 'rejected').length;

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await api.post('/api/auth/resend-verification', {});
      setResendMsg('Verification email sent! Check your inbox.');
    } catch {
      setResendMsg('Failed to send. Please try again.');
    } finally { setResendLoading(false); }
  };

  return (
    <div className="space-y-8 pb-10">

      {/* Header section with gradient */}
      <div className="bg-gradient-to-r from-[#1a2e5a] to-[#2a447a] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-white/10 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Seller Dashboard</h1>
            <p className="text-blue-100 font-medium">Manage your properties, track views, and grow your portfolio.</p>
          </div>
          <Link href="/dashboard/properties/new"
            className="bg-white text-[#1a2e5a] hover:bg-slate-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5">
            <Plus size={18} /> Add New Property
          </Link>
        </div>
      </div>

      {/* Email verification banner */}
      {!emailVerified && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0 shadow-inner">
            <MailWarning size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-amber-900 text-base mb-1">Verify your email address</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              We sent a verification link when you registered. Verified accounts receive priority listing reviews and higher visibility.
            </p>
            {resendMsg && <p className="text-sm mt-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 inline-block rounded-lg">{resendMsg}</p>}
          </div>
          <button onClick={handleResendVerification} disabled={resendLoading}
            className="shrink-0 text-sm bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-700 disabled:opacity-60 transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
            {resendLoading ? 'Sending...' : 'Resend Email'}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          { label: 'Total Listings', value: properties.length, icon: Home,        color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
          { label: 'Available',      value: available,          icon: TrendingUp,  color: 'from-emerald-400 to-emerald-500', shadow: 'shadow-emerald-500/20' },
          { label: 'Pending Review', value: pending,            icon: Clock,       color: 'from-amber-400 to-amber-500', shadow: 'shadow-amber-500/20' },
          { label: 'Sold / Rented',  value: sold,               icon: ArrowUpRight, color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
        ].map(({ label, value, icon: Icon, color, shadow }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex items-center gap-4 sm:gap-5 hover:shadow-md transition-shadow group">
            <div className={`bg-gradient-to-br ${color} w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${shadow} transform group-hover:scale-105 transition-transform`}>
              <Icon size={24} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wider truncate">{label}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1a2e5a] truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Properties Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 sm:px-8 sm:py-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 gap-3">
          <h2 className="font-extrabold text-[#1a2e5a] text-lg sm:text-xl">My Recent Listings</h2>
          {properties.length > 0 && (
            <Link href="/dashboard/properties" className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline">
              View All
            </Link>
          )}
        </div>
        
        <div className="p-4 sm:p-6 space-y-4">
          {properties.slice(0, 5).map(p => (
            <div key={p._id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group cursor-pointer">
              
              <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0 relative shadow-sm group-hover:shadow-md transition-shadow">
                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm ${
                    p.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-[#1a2e5a] truncate group-hover:text-red-600 transition-colors mb-1">{p.title}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Home size={14} className="text-slate-400" /> {p.city}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-red-600 font-bold">PKR {(p.price / 100000).toFixed(0)} Lac</span>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                  p.approvalStatus === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                  p.approvalStatus === 'rejected' ? 'bg-red-50 border-red-100 text-red-700' :
                  'bg-amber-50 border-amber-100 text-amber-700'}`}>
                  {p.approvalStatus === 'approved' && <CheckCircle size={14} />}
                  {p.approvalStatus === 'rejected' && <XCircle size={14} />}
                  {p.approvalStatus === 'pending' && <Clock size={14} />}
                  {p.approvalStatus || 'pending'}
                </span>
              </div>
            </div>
          ))}
          
          {properties.length === 0 && (
            <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Home size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2e5a] mb-2">No properties yet</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mb-6">You haven't listed any properties yet. Start adding your real estate portfolio to reach thousands of buyers.</p>
              <Link href="/dashboard/properties/new" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors">
                <Plus size={18} /> Add Your First Listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITER dashboard — shows their own blogs
// ─────────────────────────────────────────────────────────────────────────────
function WriterDashboard({ userId }: { userId: string }) {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    api.get<any>(`/api/blogs?dashboard=true&authorId=${userId}&limit=200`)
      .then(d => setBlogs(d.blogs ?? []))
      .catch(() => {});
  }, [userId]);

  const published = blogs.filter(b => b.published).length;
  const drafts    = blogs.filter(b => !b.published).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Articles',  value: blogs.length, icon: FileText,     color: 'bg-[#1a2e5a]'  },
          { label: 'Published',       value: published,     icon: TrendingUp,   color: 'bg-emerald-500' },
          { label: 'Drafts',          value: drafts,        icon: FileText,     color: 'bg-amber-500'  },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${color} w-14 h-14 rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">{label}</p>
              <p className="text-3xl font-extrabold text-[#1a2e5a]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-bold text-[#1a2e5a] text-lg">My Recent Articles</h2>
          <Link href="/dashboard/blogs/new"
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Plus size={16} /> New Article
          </Link>
        </div>
        <div className="space-y-3">
          {blogs.slice(0, 5).map(b => (
            <div key={b._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-100">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#1a2e5a] truncate">{b.title}</p>
                <p className="text-xs text-slate-400">{b.category}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${b.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {b.published ? 'Published' : 'Draft'}
              </span>
            </div>
          ))}
          {blogs.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <FileText size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No articles yet.</p>
              <Link href="/dashboard/blogs/new" className="text-red-700 font-semibold text-sm hover:underline mt-1 inline-block">
                Write your first article →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN / SUPERADMIN dashboard — full stats
// ─────────────────────────────────────────────────────────────────────────────
function AdminDashboard() {
  const [stats, setStats] = useState({ properties: 0, blogs: 0, agents: 0, unreadMessages: 0 });
  const [trafficData, setTrafficData] = useState<any[]>([]);
  
  useEffect(() => {
    const d = []; const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now); date.setDate(date.getDate() - i);
      d.push({ date: date.toISOString().split('T')[0], visitors: Math.floor(Math.random() * 200 + 100), pageViews: Math.floor(Math.random() * 500 + 200) });
    }
    setTrafficData(d);
  }, []);
  const [propertyTypes, setPropertyTypes] = useState<{ name: string; value: number }[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<any>('/api/properties?dashboard=true&limit=200'),
      api.get<any>('/api/blogs?dashboard=true&limit=200'),
      api.get<any>('/api/agents?limit=200'),
      api.get<any>('/api/contact'),
    ]).then(([props, blogs, agents, messages]) => {
      const properties = props.properties ?? [];
      const blogList   = blogs.blogs ?? [];
      const agentList  = Array.isArray(agents) ? agents : [];
      const msgList    = Array.isArray(messages) ? messages : [];
      setStats({
        properties: properties.length,
        blogs: blogList.filter((b: any) => b.published).length,
        agents: agentList.filter((a: any) => a.active).length,
        unreadMessages: msgList.filter((m: any) => !m.read).length,
      });
      const typeCount: Record<string, number> = {};
      properties.forEach((p: any) => { typeCount[p.type] = (typeCount[p.type] || 0) + 1; });
      setPropertyTypes(Object.entries(typeCount).map(([name, value]) => ({ name, value })));
      setRecentMessages(msgList.slice(0, 5));
    }).catch(() => {});
  }, []);

  const COLORS = ['#c0392b', '#1a2e5a', '#f39c12', '#27ae60'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Properties', value: stats.properties,      icon: Home,          color: 'bg-blue-500'   },
          { label: 'Published Blogs',  value: stats.blogs,           icon: FileText,      color: 'bg-red-600'    },
          { label: 'Active Agents',    value: stats.agents,          icon: Users,         color: 'bg-emerald-500' },
          { label: 'Unread Messages',  value: stats.unreadMessages,  icon: MessageSquare, color: 'bg-amber-500'  },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${color} w-14 h-14 rounded-xl flex items-center justify-center shrink-0`}><Icon size={24} className="text-white" /></div>
            <div><p className="text-slate-500 text-sm">{label}</p><p className="text-3xl font-extrabold text-[#1a2e5a]">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h2 className="font-bold text-[#1a2e5a] text-lg">Website Traffic (Last 14 Days)</h2>
            <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-semibold">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c0392b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c0392b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="visitors"  stroke="#c0392b" fill="url(#colorVisitors)" strokeWidth={2} name="Visitors" />
              <Area type="monotone" dataKey="pageViews" stroke="#1a2e5a" fill="none" strokeWidth={2} strokeDasharray="4 4" name="Page Views" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-[#1a2e5a] text-lg mb-4">Property Types</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={propertyTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name">
                {propertyTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-[#1a2e5a] text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Blog Post',   href: '/dashboard/blogs/new',       icon: FileText,      color: 'bg-red-700'    },
              { label: 'Add Property',    href: '/dashboard/properties/new',  icon: Home,          color: 'bg-[#1a2e5a]'  },
              { label: 'Add Agent',       href: '/dashboard/agents/new',      icon: Users,         color: 'bg-emerald-600' },
              { label: 'Inquiries',       href: '/dashboard/inquiries',       icon: TrendingUp,    color: 'bg-amber-500'  },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link key={href} href={href} className={`${color} hover:opacity-90 text-white rounded-xl p-4 flex items-center gap-3 transition-opacity`}>
                <Icon size={20} /><span className="font-semibold text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h2 className="font-bold text-[#1a2e5a] text-lg">Recent Messages</h2>
            <Link href="/dashboard/messages" className="text-red-700 text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg: any) => (
              <div key={msg._id} className={`flex items-start gap-3 p-3 rounded-lg ${msg.read ? 'bg-gray-50' : 'bg-red-50'}`}>
                <div className="w-8 h-8 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{msg.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1a2e5a] truncate">{msg.name}</p>
                  <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                </div>
                {!msg.read && <span className="w-2 h-2 bg-red-600 rounded-full mt-1.5 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — picks the right dashboard by role
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const user = useCurrentUser();
  if (!user) return null;

  const uid = user.id || (user as any)._id;

  if (user.role === 'seller') return <SellerDashboard userId={uid} emailVerified={user.emailVerified} />;
  if (user.role === 'writer') return <WriterDashboard userId={uid} />;
  return <AdminDashboard />;
}
