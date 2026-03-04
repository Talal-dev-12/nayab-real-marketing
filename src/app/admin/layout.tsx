'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Home, Users, MessageSquare,
  Settings, LogOut, Menu, X, BarChart3, Bell, ChevronRight, ShieldCheck
} from 'lucide-react';

interface AdminUser { id: string; name: string; email: string; role: string; avatar?: string; }

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blogs', label: 'Blog Posts', icon: FileText },
  { href: '/admin/properties', label: 'Properties', icon: Home },
  { href: '/admin/agents', label: 'Agents', icon: Users },
  { href: '/admin/admins', label: 'Admin Users', icon: ShieldCheck },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return; }

    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token with server
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setAuthed(true);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
      })
      .finally(() => setLoading(false));

    // Optimistically show from localStorage while validating
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="text-white">Loading...</div></div>;
  if (pathname === '/admin/login') return <>{children}</>;
  if (!authed) return null;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f1e3d] flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <div>
              <div className="text-red-400 font-bold text-sm">NAYAB REAL</div>
              <div className="text-white text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
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
                <div className="text-slate-400 text-xs truncate">{user.role}</div>
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

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="font-bold text-[#1a2e5a] text-lg capitalize">
                {navItems.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-500">{new Date().toDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative"><Bell size={20} className="text-slate-500" /></button>
            <Link href="/" target="_blank" className="text-xs bg-red-700 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 font-medium">View Site ↗</Link>
            <div className="w-9 h-9 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white font-bold text-sm">{initials}</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
