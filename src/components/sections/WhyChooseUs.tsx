import { Shield, Home, TrendingUp, Key, Award, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Trusted by Thousands',
    description: 'Over 2,000 happy families trust Nayab Real Marketing to find their dream homes across Pakistan.',
    color: 'bg-red-50 text-primary',
  },
  {
    icon: Home,
    title: 'Wide Range of Properties',
    description: 'From cozy apartments to luxury villas, we have listings across all major cities and categories.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'Financing Made Easy',
    description: 'We partner with leading banks to offer the best mortgage and installment plans for buyers.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Key,
    title: 'Quick Property Transfer',
    description: 'Hassle-free documentation and transfer process — our legal team handles everything.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Award,
    title: '15+ Years of Experience',
    description: 'Decades of expertise in Pakistan\'s real estate market means you\'re always in safe hands.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Users,
    title: '50+ Expert Agents',
    description: 'Our team of certified agents is available 7 days a week to guide you through every step.',
    color: 'bg-orange-50 text-orange-600',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="section-subtitle">Why Choose Us</p>
            <h2 className="section-title">Pakistan's Most Trusted Real Estate Partner</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              At Nayab Real Marketing, we believe finding the right property should be exciting, not stressful. 
              Our team of dedicated professionals works tirelessly to match every client with their perfect property 
              — at the right price, in the right location.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { num: '5,000+', label: 'Properties Listed' },
                { num: '2,000+', label: 'Happy Clients' },
                { num: '15+', label: 'Years in Business' },
                { num: '50+', label: 'Expert Agents' },
              ].map((stat) => (
                <div key={stat.label} className="border border-gray-100 rounded-xl p-5 text-center hover:border-primary hover:shadow-md transition-all">
                  <div className="font-heading text-3xl font-bold text-primary mb-1">{stat.num}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
            <a href="/about" className="btn-primary inline-block">
              Learn More About Us
            </a>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-navy text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
