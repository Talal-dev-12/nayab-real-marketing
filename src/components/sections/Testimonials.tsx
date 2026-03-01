import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed Khan',
    role: 'Homebuyer, Karachi',
    avatar: 'AK',
    rating: 5,
    text: 'Nayab Real Marketing helped me find my dream home in DHA within weeks. Their team was professional, responsive, and truly cared about my budget and requirements.',
    color: 'bg-red-500',
  },
  {
    name: 'Fatima Malik',
    role: 'Property Investor, Lahore',
    avatar: 'FM',
    rating: 5,
    text: 'As a real estate investor, I have worked with many agencies. Nayab stands out for their market knowledge and transparent dealings. Highly recommended!',
    color: 'bg-blue-600',
  },
  {
    name: 'Usman Tariq',
    role: 'Business Owner, Islamabad',
    avatar: 'UT',
    rating: 5,
    text: 'Found the perfect office space for my startup through Nayab. The process was seamless from search to handover. They handled all paperwork efficiently.',
    color: 'bg-green-600',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary uppercase tracking-widest text-sm font-bold mb-3">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Don't just take our word for it — hear from the families and investors who've found their perfect properties with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors duration-300 relative">
              <Quote className="text-primary opacity-30 absolute top-6 right-6" size={40} />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed mb-7 text-sm">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
