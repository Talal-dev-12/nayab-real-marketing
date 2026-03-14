'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Plus, LogOut, Menu, X, PenTool, ChevronRight } from 'lucide-react';

interface PortalUser { id: string; name: string; email: string; role: string; }

const NAV = [
  { href: '/writer',           label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/writer/blogs',     label: 'My Articles', icon: FileText        },
  { href: '/writer/blogs/new', label: 'New Article', icon: Plus            },
];

export default function WriterLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open,    setOpen]    = useState(false);
  const [user,    setUser]    = useState<PortalUser | null>(null);
  const [authed,  setAuthed]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/writer/login') { setLoading(false); return; }
    const token  = localStorage.getItem('writer_token');
    const stored = localStorage.getItem('writer_user');
    if (!token) { router.push('/writer/login'); return; }
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => {
        if (d.user.role !== 'writer') throw new Error('Not a writer');
        setUser(d.user); setAuthed(true);
      })
      .catch(() => {
        localStorage.removeItem('writer_token'); localStorage.removeItem('writer_user');
        router.push('/writer/login');
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('writer_token'); localStorage.removeItem('writer_user');
    router.push('/writer/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="text-white">Loading...</div></div>;
  if (pathname === '/writer/login') return <>{children}</>;
  if (!authed) return null;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'W';

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f1e3d] flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center"><PenTool size={20} className="text-white" /></div>
            <div><div className="text-emerald-400 font-bold text-sm">NAYAB REAL</div><div className="text-white text-xs">Writer Portal</div></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/writer' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                <Icon size={18} />{label}{active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
              <div className="min-w-0"><div className="text-white text-xs font-semibold truncate">{user.name}</div><div className="text-slate-400 text-xs">Content Writer</div></div>
            </div>
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-700 hover:text-white w-full text-sm font-medium transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
            <div>
              <h1 className="font-bold text-[#1a2e5a] text-lg">{NAV.find(n => n.href === pathname || (n.href !== '/writer' && pathname.startsWith(n.href)))?.label || 'Dashboard'}</h1>
              <p className="text-xs text-slate-500">Writer Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/blog" target="_blank" className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-500 font-medium">View Blog ↗</Link>
            <div className="w-9 h-9 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white font-bold text-sm">{initials}</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
