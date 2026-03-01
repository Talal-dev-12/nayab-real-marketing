'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveToStorage, STORAGE_KEYS } from '@/lib/data';
import { Lock, Eye, EyeOff, Home } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // Default credentials: admin / admin123
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        saveToStorage(STORAGE_KEYS.ADMIN_AUTH, true);
        router.push('/admin');
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Home size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1a2e5a]">NAYAB REAL</h1>
          <p className="text-slate-500 text-sm">Admin Panel Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors"
              placeholder="Enter username"
              value={credentials.username}
              onChange={e => setCredentials(c => ({ ...c, username: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors pr-12"
                placeholder="Enter password"
                value={credentials.password}
                onChange={e => setCredentials(c => ({ ...c, password: e.target.value }))}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Lock size={16} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* <div className="mt-6 bg-slate-50 rounded-xl p-4 text-xs text-slate-500 text-center">
          Default credentials:<br />
          Username: <strong>admin</strong> | Password: <strong>admin123</strong>
        </div> */}
      </div>
    </div>
  );
}
