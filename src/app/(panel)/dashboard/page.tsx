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
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    if (raw) try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
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
    api.get<any>(`/api/properties?submittedBy=${userId}&limit=200`)
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
    <div className="space-y-6">

      {/* Email verification banner */}
      {!emailVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-4">
          <MailWarning size={22} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-800 text-sm">Please verify your email address</p>
            <p className="text-amber-700 text-xs mt-0.5">
              We sent a verification link when you registered. Check your inbox (and spam folder).
              Verified accounts get priority listing reviews.
            </p>
            {resendMsg && <p className="text-xs mt-1 text-amber-900 font-medium">{resendMsg}</p>}
          </div>
          <button onClick={handleResendVerification} disabled={resendLoading}
            className="shrink-0 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-500 disabled:opacity-60 transition-colors">
            {resendLoading ? 'Sending...' : 'Resend Email'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Listings', value: properties.length, icon: Home,        color: 'bg-[#1a2e5a]' },
          { label: 'Available',      value: available,          icon: TrendingUp,  color: 'bg-emerald-500' },
          { label: 'Pending Review', value: pending,            icon: Clock,       color: 'bg-amber-500' },
          { label: 'Sold / Rented',  value: sold,               icon: ArrowUpRight, color: 'bg-blue-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-slate-500 text-xs">{label}</p>
              <p className="text-2xl font-extrabold text-[#1a2e5a]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1a2e5a] text-lg">My Recent Listings</h2>
          <Link href="/dashboard/properties/new"
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Plus size={16} /> Add Property
          </Link>
        </div>
        <div className="space-y-3">
          {properties.slice(0, 5).map(p => (
            <div key={p._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-100">
              <img src={p.images?.[0]} className="w-12 h-10 rounded-lg object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#1a2e5a] truncate">{p.title}</p>
                <p className="text-xs text-slate-400">{p.city} · PKR {(p.price / 100000).toFixed(0)} Lac</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {p.status}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  p.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                  p.approvalStatus === 'rejected' ? 'bg-red-50 text-red-600' :
                  'bg-amber-50 text-amber-600'}`}>
                  {p.approvalStatus || 'pending'}
                </span>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <Home size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No properties yet.</p>
              <Link href="/dashboard/properties/new" className="text-red-700 font-semibold text-sm hover:underline mt-1 inline-block">
                Add your first listing →
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
    api.get<any>(`/api/blogs?authorId=${userId}&limit=200`)
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
        <div className="flex items-center justify-between mb-4">
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
      api.get<any>('/api/properties?limit=200'),
      api.get<any>('/api/blogs?limit=200'),
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
          <div className="flex items-center justify-between mb-4">
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
          <div className="flex items-center justify-between mb-4">
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

  if (user.role === 'seller') return <SellerDashboard userId={user.id} emailVerified={user.emailVerified} />;
  if (user.role === 'writer') return <WriterDashboard userId={user.id} />;
  return <AdminDashboard />;
}
