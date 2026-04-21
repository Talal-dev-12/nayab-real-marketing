   
import { Metadata } from 'next';
import { Home, Building2, TrendingUp, FileText, Paintbrush, Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: "Our Services | Nayab Real Marketing",
  description: "Comprehensive real estate services including property buying & selling, rentals, investment consulting, valuation, legal documentation, and interior design.",
  keywords: "real estate services, property valuation, investment consulting, legal documentation, interior design Karachi",
  openGraph: {
    title: "Our Services | Nayab Real Marketing",
    description: "Explore our comprehensive real estate services in Pakistan.",
    url: "https://nayabrealmarketing.com/services",
    siteName: "Nayab Real Marketing",
    type: "website",
  },
};
import Link from 'next/link';

const services = [
  {
    icon: Home,
    title: 'Property Buying & Selling',
    desc: 'We help you buy or sell residential properties at the best market price. Our agents negotiate on your behalf to ensure maximum value.',
    features: ['Market valuation', 'Buyer/seller matching', 'Price negotiation', 'Legal verification'],
  },
  {
    icon: Building2,
    title: 'Property Rentals',
    desc: 'Find your perfect rental — from apartments and houses to commercial spaces and offices. We handle everything from listing to lease signing.',
    features: ['Tenant screening', 'Rent agreements', 'Property management', 'Rent collection'],
  },
  {
    icon: TrendingUp,
    title: 'Investment Consulting',
    desc: 'Make smart real estate investments with our expert advice. We analyze market trends and identify high-ROI opportunities for you.',
    features: ['Market analysis', 'ROI projections', 'Portfolio planning', 'Risk assessment'],
  },
  {
    icon: Calculator,
    title: 'Property Valuation',
    desc: 'Get accurate market valuations for any property. Our certified valuers use the latest data to give you precise property assessments.',
    features: ['Certified valuers', 'Market comparison', 'Written reports', 'Online estimates'],
  },
  {
    icon: FileText,
    title: 'Legal Documentation',
    desc: 'Navigate complex paperwork with ease. Our legal team handles all documentation from NOCs to sale deeds and lease agreements.',
    features: ['Sale deeds', 'NOC assistance', 'Lease agreements', 'Title verification'],
  },
  {
    icon: Paintbrush,
    title: 'Interior Design',
    desc: 'Transform your new property into a dream home. Our interior design consultants create beautiful, functional spaces tailored to you.',
    features: ['Space planning', '3D visualization', 'Material selection', 'Project management'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="primary-gradient py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Our Services</h1>
        <p className="text-slate-400">Comprehensive real estate services to meet all your property needs</p>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(({ icon: Icon, title, desc, features }) => (
            <div key={title} className="bg-white rounded-2xl shadow-md p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-red-700 group-hover:bg-[#1a2e5a] rounded-xl flex items-center justify-center mb-5 transition-colors">
                <Icon size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2e5a] mb-3">{title}</h3>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">{desc}</p>
              <ul className="space-y-2 mb-6">
                {features.map(f => (
                  <li key={f} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-700 rounded-full" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="text-red-700 font-semibold text-sm hover:underline">
                Get Started →
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
