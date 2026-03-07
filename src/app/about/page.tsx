import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Award, Users, Home, Star, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      

      <div className="bg-[#1a2e5a] py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">About Us</h1>
        <p className="text-slate-400">Learn about Nayab Real Marketing and our commitment to you</p>
      </div>

      {/* Story Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-red-700 font-semibold uppercase tracking-widest text-sm mb-2">Our Story</p>
            <h2 className="text-4xl font-extrabold text-[#1a2e5a] mb-6">Trusted Real Estate Partner Since 2010</h2>
            <p className="text-slate-500 mb-4 leading-relaxed">
              Nayab Real Marketing was founded with a simple mission: to make buying, selling, and renting property in Pakistan a transparent, trustworthy, and stress-free experience.
            </p>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Over 14 years, we've helped thousands of families and businesses find their perfect properties across Karachi, Lahore, and Islamabad. Our team of dedicated professionals brings deep local market knowledge and unwavering integrity to every transaction.
            </p>
            <div className="space-y-3">
              {['Verified & legal properties only', 'Transparent pricing — no hidden fees', 'Expert guidance from search to handover', 'Complete legal documentation support'].map(p => (
                <div key={p} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-red-700 shrink-0" />
                  <span className="text-slate-700 font-medium">{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600" alt="Office" className="rounded-2xl object-cover h-64 w-full" />
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600" alt="Team" className="rounded-2xl object-cover h-64 w-full mt-8" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a2e5a] py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '14+', label: 'Years in Business', icon: Award },
            { value: '2500+', label: 'Properties Sold', icon: Home },
            { value: '1200+', label: 'Happy Clients', icon: Users },
            { value: '4.9★', label: 'Average Rating', icon: Star },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label}>
              <Icon className="text-red-400 mx-auto mb-2" size={28} />
              <div className="text-4xl font-extrabold">{value}</div>
              <div className="text-slate-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
