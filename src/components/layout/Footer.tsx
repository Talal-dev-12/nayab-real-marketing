import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
export default function Footer() {
  return (
    <footer className="bg-[#0f1e3d] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <div>
                <Image
                  src={logo}
                  alt="Nayab Real Marketing"
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
                  loading="eager"
                />
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your trusted partner in real estate. We help you find the perfect
              property — whether you're buying, selling, or renting in Pakistan.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/nayabrealmarketing" },
                { icon: Twitter, href: "https://twitter.com/nayabrealmarketing" },
                { icon: Instagram, href: "https://www.instagram.com/nayabrealmarketing" },
                { icon: Youtube, href: "https://www.youtube.com/channel/UC_Xt5Q5X5Q5X5Q5X5Q5X5Q5" },
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
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Properties for Sale", href: "/properties?type=sale" },
                { label: "Properties for Rent", href: "/properties?type=rent" },
                { label: "Our Agents", href: "/agents" },
                { label: "Blog & News", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-red-400 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="text-red-700">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wide">
              Our Services
            </h3>
            <ul className="space-y-2">
              {[
                "Property Buying & Selling",
                "Property Rentals",
                "Investment Consulting",
                "Property Valuation",
                "Legal Documentation",
                "Interior Design",
              ].map((s) => (
                <li
                  key={s}
                  className="text-slate-400 text-sm flex items-center gap-2"
                >
                  <span className="text-red-700">›</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wide">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                <span className="text-slate-400">
                  <Link href="https://maps.app.goo.gl/rMSkd7VNLDXzUUnaA" className="hover:text-red-700 transition">
                    B-22 Sector 15/A, KDA Employees Society Gulzar-e-Hijri, Scheme
                    33 Karachi – 75330, Pakistan
                  </Link>
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone size={16} className="text-red-500 shrink-0" />
                <div className="text-slate-400 flex flex-col">
                  <a
                    href="tel:+923212869000"
                    className="hover:text-red-700 transition"
                  >
                    +92 321 2869000 (Office)
                  </a>
                  <a
                    href="tel:+923113855950"
                    className="hover:text-red-700 transition"
                  >
                    +92 311 3855950 (Personal)
                  </a>
                </div>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail size={16} className="text-red-500 shrink-0" />
                <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nayabrealmarketing.official@gmail.com'}`} className="text-slate-400 hover:text-red-400 transition-colors">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nayabrealmarketing.official@gmail.com'}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
          <p
            className="text-slate-500 text-sm text-center md:text-left"
            suppressHydrationWarning
          >
            © {new Date().getFullYear()} Nayab Real Marketing. All rights
            reserved.
          </p>

          <div className="flex gap-6 text-sm text-slate-500">
            <Link
              href="/privacy-policy"
              className="hover:text-red-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-red-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
        <p className="text-slate-500 text-sm text-center md:text-right">
          Designed & developed by{" "}
          <Link
            href="https://nayabrealmarketing.com"
            className="hover:text-red-400 transition-colors"
          >
            Nayab Marketing
          </Link>
        </p>
      </div>
    </footer>
  );
}
