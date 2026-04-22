// src/app/not-found.tsx

import Link from "next/link";
import { Home, Search, Phone, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">

        {/* Animated 404 number */}
        <div className="relative mb-8 select-none">
          <p className="text-[180px] md:text-[220px] font-extrabold leading-none text-[#1a2e5a] opacity-[0.06]">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl px-10 py-8 border border-slate-100">
              <div className="w-20 h-20 bg-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home size={36} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-[#1a2e5a] mb-2">
                Page Not Found
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                The property or page you are looking for doesn't exist or may
                have been removed.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            <Home size={16} /> Go to Homepage
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 bg-[#1a2e5a] hover:bg-[#0f1e3d] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            <Search size={16} /> Browse Properties
          </Link>
          <a
            href="tel:+923212869000"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#1a2e5a] text-[#1a2e5a] hover:bg-[#1a2e5a] hover:text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            <Phone size={16} /> Call Us
          </a>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            You might be looking for
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Properties", href: "/properties" },
              { label: "Blog", href: "/blog" },
              { label: "Agents", href: "/agents" },
              { label: "About Us", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
              { label: "Tools", href: "/tools" },
              { label: "Sign In", href: "/sign-in" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[#1a2e5a] font-medium bg-slate-50 hover:bg-red-50 hover:text-red-700 px-4 py-2.5 rounded-lg transition-colors text-center"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          Nayab Real Marketing · +92-321-2869000 · nayabrealmarketing.official@gmail.com
        </p>

      </div>
    </div>
  );
}