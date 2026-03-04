"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/images/logo.svg";
import Image from "next/image";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/agents", label: "Agents" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-red-700 text-white py-2 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone size={14} />
              +92-300-1234567
            </span>
            <span>info@nayabrealestate.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`bg-[#1a2e5a] sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative w-64 h-16">
                <Image
                  src={logo}
                  alt="Nayab Real Marketing Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-200 hover:text-red-400 px-4 py-2 font-semibold transition-colors duration-200 text-sm uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="ml-4 bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded font-semibold text-sm transition-colors"
              >
                Get Free Consultation
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0f1e3d] border-t border-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-6 py-4 text-slate-200 hover:text-red-400 hover:bg-slate-800 font-medium border-b border-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
