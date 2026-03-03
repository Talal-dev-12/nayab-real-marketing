import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f1e3d] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <div className="text-red-400 font-extrabold text-xl">NAYAB REAL</div>
              <div className="text-white font-bold text-lg tracking-widest">MARKETING</div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your trusted partner in real estate. We help you find the perfect property — whether you're buying, selling, or renting in Pakistan.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-slate-700 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Properties for Sale', href: '/properties?type=sale' },
                { label: 'Properties for Rent', href: '/properties?type=rent' },
                { label: 'Our Agents', href: '/agents' },
                { label: 'Blog & News', href: '/blog' },
                { label: 'Contact Us', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-red-400 text-sm transition-colors flex items-center gap-2">
                    <span className="text-red-700">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wide">Our Services</h3>
            <ul className="space-y-2">
              {[
                'Property Buying & Selling',
                'Property Rentals',
                'Investment Consulting',
                'Property Valuation',
                'Legal Documentation',
                'Interior Design',
              ].map((s) => (
                <li key={s} className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="text-red-700">›</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wide">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                <span className="text-slate-400">Office 301, XYZ Plaza, Shahrah-e-Faisal, Karachi, Pakistan</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone size={16} className="text-red-500 shrink-0" />
                <div className="text-slate-400">
                  <div>+92-300-1234567</div>
                  <div>+92-21-1234567</div>
                </div>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail size={16} className="text-red-500 shrink-0" />
                <span className="text-slate-400">info@nayabrealestate.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm" suppressHydrationWarning>
            © {new Date().getFullYear()} Nayab Real Marketing. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/privacy-policy" className="hover:text-red-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-red-400 transition-colors">Terms of Service</Link>
            <Link href="/admin" className="hover:text-red-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
