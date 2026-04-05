import Link from "next/link";
import { Phone } from "lucide-react";

export default function CallToAction() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&auto=format&fit=crop)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#1a2e5a] opacity-90" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-slate-300 mb-8 text-lg">
          Get a free consultation with our real estate experts today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-red-700 hover:bg-red-600 active:scale-95 text-white px-8 py-4 rounded-lg font-bold text-base transition-all shadow-lg shadow-red-900/40"
          >
            Get Free Consultation
          </Link>
          <a
            href="tel:+923212869000"
            className="border-2 border-white text-white hover:bg-white hover:text-[#1a2e5a] active:scale-95 px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center gap-2 justify-center"
          >
            <Phone size={18} /> Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
