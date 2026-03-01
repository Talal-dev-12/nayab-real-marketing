import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';

export default function CTABanner() {
  return (
    <section
      className="relative py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(204,0,0,0.9), rgba(153,0,0,0.95)), url('https://images.unsplash.com/photo-1582407947304-fd86f28f3a9d?w=1200&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-red-100 text-lg max-w-2xl mx-auto mb-10">
          Our expert agents are ready to guide you through every step. Get a free consultation today and let's find the perfect property for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/properties"
            className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            Browse Properties <ArrowRight size={18} />
          </Link>
          <a
            href="tel:+92300000000"
            className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Phone size={18} /> Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
