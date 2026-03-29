'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Home, Users, MessageSquare,
  Settings, LogOut, Menu, X, BarChart3, Bell, ChevronRight,
  ShieldCheck, PenTool, PlusSquare, PenLine, Send,
} from 'lucide-react';
import { ALL_NAV, PANEL_ROLES, ROLE_META } from '@/lib/rbac';
import type { UserRole } from '@/lib/jwt';

// Map icon string → lucide component
const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, FileText, Home, Users, MessageSquare,
  Settings, BarChart3, ShieldCheck, PenTool, PlusSquare, PenLine,
};

interface AuthUser { id: string; name: string; email: string; role: string; avatar?: string; }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed,      setAuthed]      = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [user,        setUser]        = useState<AuthUser | null>(null);

  useEffect(() => {
    const token      = localStorage.getItem('auth_token') ?? localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('auth_user')  ?? localStorage.getItem('admin_user');

    if (!token) { router.push('/sign-in'); return; }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (!res.ok) throw new Error('Unauthorized'); return res.json(); })
      .then(data => {
        const role = data.user.role as UserRole;
        // Block public users from the panel
        if (!PANEL_ROLES.includes(role)) {
          router.push('/sign-in');
          return;
        }
        setUser(data.user);
        setAuthed(true);
      })
      .catch(() => {
        ['auth_token','auth_user','admin_token','admin_user'].forEach(k => localStorage.removeItem(k));
        router.push('/sign-in');
      })
      .finally(() => setLoading(false));

    if (storedUser) { try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ } }
  }, [pathname]);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
    ['auth_token','auth_user','admin_token','admin_user','agent_token','agent_user','writer_token','writer_user']
      .forEach(k => localStorage.removeItem(k));
    router.push('/sign-in');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-white text-sm">Loading…</div>
    </div>
  );
  if (!authed) return null;

  const role     = (user?.role ?? '') as UserRole;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const roleMeta = ROLE_META[role];

  // Filter nav to current role — also skip "Add Property" & "New Article" from sidebar
  // (they're accessible via buttons on the list pages, sidebar gets top-level items only)
  const SKIP_FROM_SIDEBAR = ['/dashboard/properties/new', '/dashboard/blogs/new'];
  const navItems = ALL_NAV
    .filter(n => n.roles.includes(role))
    .filter(n => !SKIP_FROM_SIDEBAR.includes(n.href));

  // Page title — find deepest matching nav item
  const activeNav = [...ALL_NAV]
    .reverse()
    .find(n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)));

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f1e3d] flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <div>
              <Link href="/"><div className="text-red-400 font-bold text-sm">NAYAB REAL</div></Link>
              {/* Panel label adapts to role */}
              <div className="text-white text-xs capitalize">{roleMeta?.label ?? role} Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: iconName }) => {
            const Icon     = ICON_MAP[iconName] ?? LayoutDashboard;
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-red-700 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                <Icon size={18} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-semibold truncate">{user.name}</div>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${roleMeta?.color ?? ''}`}>
                  {roleMeta?.label ?? role}
                </span>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-700 hover:text-white w-full text-sm font-medium transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="font-bold text-[#1a2e5a] text-lg">{activeNav?.label ?? 'Dashboard'}</h1>
              <p className="text-xs text-slate-500">{new Date().toDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative"><Bell size={20} className="text-slate-500" /></button>
            <Link href="/" target="_blank" className="text-xs bg-red-700 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 font-medium">
              View Site ↗
            </Link>
            <div className="w-9 h-9 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
