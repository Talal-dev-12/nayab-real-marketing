import { Metadata } from 'next';
import React from 'react';
import { Award, Users, Home, Star, CheckCircle, Building, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Us | Nayab Real Marketing",
  description: "Learn about the history of Nayab Real Marketing. Established in 1997, we provide trustworthy and experienced real estate guidance across Pakistan.",
  keywords: "about Nayab Real Marketing, real estate agency Karachi, property experts Pakistan",
  openGraph: {
    title: "About Us | Nayab Real Marketing",
    description: "Discover our journey of trust, resilience, and real estate excellence since 1997.",
    url: "https://nayabrealmarketing.com/about",
    siteName: "Nayab Real Marketing",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="primary-gradient py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">About Us</h1>
        <p className="text-blue-100 max-w-2xl mx-auto">
          Discover the history of Nayab Real Marketing and our journey of trust, resilience, and real estate excellence since 1997.
        </p>
      </div>

      {/* Story Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Text Content */}
          <div>
            <p className="text-red-700 font-semibold uppercase tracking-widest text-sm mb-2">Our Journey</p>
            <h2 className="text-4xl font-extrabold text-[#1a2e5a] mb-6">Built on Resilience & Experience</h2>
            
            <div className="space-y-4 text-slate-600 mb-8 leading-relaxed">
              <p>
                Our roots in the property sector go all the way back to 1997. What started as a part-time passion alongside a regular job quickly grew. We spent our holidays meeting seasoned professionals and major investors, learning the intricacies of the market and understanding exactly what clients needed.
              </p>
              <p>
                In 2003, we took a leap of faith, left our full-time jobs, and opened our first office in DHA Phase 2 Extension. The early days were intensely challenging. As newcomers in DHA, finding investors was difficult, and after two years, we had to close that setup. However, the high-level corporate dealing experience we gained there became our greatest asset.
              </p>
              <p>
                We shifted our focus to Scheme 33 Ahsanabad, where we found great success. But the journey wasn't without its storms. Following the government change in 2007, the property market faced a massive downturn. We navigated through five incredibly tough years, proving our resilience.
              </p>
              <p className="font-semibold text-slate-800">
                In 2008, a new chapter began. A. Nadeem, Adnan Ahmed, and Munir Ahmed united to officially form <span className="text-[#1a2e5a]">Nayab Real Marketing</span>.
              </p>
              <p>
                We brought together local experts and large investors to create a powerful organization. We successfully developed, marketed, and sold massive projects in Scheme 33. Having seen every high and low of the property market, our vast experience is the foundation of the trustworthy guidance we provide today.
              </p>
            </div>

            {/* Current Services */}
            <h3 className="text-xl font-bold text-[#1a2e5a] mb-4">What We Do Today</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Project Marketing & Sales', 
                'Interior Design Solutions', 
                'Construction Services', 
                'Flawless Legal Documentations'
              ].map((service) => (
                <div key={service} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <CheckCircle size={18} className="text-red-700 shrink-0" />
                  <span className="text-slate-700 font-medium text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4 sticky top-8">
            <img 
              src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600" 
              alt="Real Estate Building" 
              className="rounded-2xl object-cover h-64 w-full shadow-lg" 
            />
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600" 
              alt="Team Meeting" 
              className="rounded-2xl object-cover h-64 w-full mt-8 shadow-lg" 
            />
            <div className="col-span-2 bg-[#1a2e5a] rounded-2xl p-6 text-white shadow-lg mt-2">
              <h4 className="font-bold text-lg mb-2">Why Choose Us?</h4>
              <p className="text-sm text-blue-100 opacity-90">
                Because we have been active in the market since 1997 and running Nayab Real Marketing since 2008, we have seen every phase of the real estate sector. Whether you are an investor or looking for your dream home, we know exactly how to guide you safely and profitably.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1a2e5a] py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '1997', label: 'Industry Experience Since', icon: Award },
            { value: '2008', label: 'Nayab Established In', icon: Building },
            { value: '3', label: 'Founding Members', icon: Users },
            { value: '100+', label: 'Major Projects Marketed', icon: Star },
          ].map(({ value, label, icon: Icon }) => (
             <div key={label} className="p-4 rounded-xl hover:bg-blue-900/50 transition-colors">
              <Icon className="text-red-400 mx-auto mb-3" size={32} />
              <div className="text-4xl font-extrabold mb-1">{value}</div>
              <div className="text-slate-300 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}