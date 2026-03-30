"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Mail,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import Button  from "../ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/agents", label: "Agents" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface AuthUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Roles that have a dashboard portal
const DASHBOARD_ROLES = ["admin", "superadmin", "writer", "agent", "seller"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Scroll shadow ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Read auth state from localStorage ────────────────────────────────────
  useEffect(() => {
    const raw =
      localStorage.getItem("auth_user") ?? localStorage.getItem("admin_user");
    if (raw) {
      try {
        setAuthUser(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    } else {
      setAuthUser(null);
    }
  }, [pathname]); // re-run on route change so state stays in sync after login/logout

  // ── Close dropdown when clicking outside ─────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    [
      "auth_token",
      "auth_user",
      "admin_token",
      "admin_user",
      "agent_token",
      "agent_user",
      "writer_token",
      "writer_user",
    ].forEach((k) => localStorage.removeItem(k));
    setAuthUser(null);
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const initials =
    authUser?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const hasDashboard = authUser && DASHBOARD_ROLES.includes(authUser.role);

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="bg-red-700 text-white py-2 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone size={16} />
              <a
                href="tel:+923212869000"
                className="hover:text-gray-200 transition"
              >
                +92 321 2869000
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} />
              <a
                href="mailto:info@nayabrealestate.com"
                className="hover:text-gray-200 transition"
              >
                info@nayabrealmarketing.com
              </a>
            </span>
          </div>
          <span>Mon - Thursday : 11:00 AM - 7:00 PM</span>
        </div>
      </div>

      {/* ── Main Navbar ─────────────────────────────────────────────────── */}
      <nav
        className={`bg-[#1a2e5a] sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-xl" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Nayab Real Marketing"
                width={200}
                height={60}
                className="w-[130px] sm:w-[150px] md:w-[170px] lg:w-[190px] h-auto"
                loading="eager"
              />
            </Link>

            {/* ── Desktop Menu ─────────────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-red-400 border-b-2 border-red-500"
                      : "text-slate-200 hover:text-red-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* CTA */}
              <Link
                href={authUser ? "/contact" : "/sign-in"}
                className="ml-4 bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded font-semibold text-sm transition-colors"
              >
                Get Free Consultation
              </Link>

              {/* ── Auth area ── */}
              {authUser ? (
                /* Logged-in user avatar + dropdown */
                <div className="relative ml-3" ref={dropdownRef}>
                  <button 
                     onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full pl-1 pr-3 py-1"
                  >
                    {authUser.avatar ? (
                      <img
                        src={authUser.avatar}
                        alt={authUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {initials}
                      </div>
                    )}
                    <span className="text-white text-sm font-medium max-w-[100px] truncate">
                      {authUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-300 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      {/* User info */}
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {authUser.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {authUser.email}
                        </p>
                      </div>
                      {hasDashboard && (
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard
                            size={15}
                            className="text-slate-400"
                          />
                          Dashboard
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                      >
                        <User size={15} className="text-slate-400" />
                        My Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest — Sign In button */
                <Link
                  href="/sign-in"
                  className="ml-3 flex items-center gap-2 border-2 border-white/30 hover:border-white/70 hover:bg-white/10 text-white px-4 py-2 rounded font-semibold text-sm transition-all"
                >
                  <LogIn size={15} />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0f1e3d] border-t border-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-6 py-4 font-medium border-b border-slate-700 transition-colors ${
                  pathname === link.href
                    ? "text-red-400 bg-slate-800"
                    : "text-slate-200 hover:text-red-400 hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile auth section */}
            {authUser ? (
              <div className="p-4 border-b border-slate-700">
                {/* User info strip */}
                <div className="flex items-center gap-3 mb-3 px-2">
                  {authUser.avatar ? (
                    <img
                      src={authUser.avatar}
                      alt={authUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {authUser.name}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {authUser.email}
                    </p>
                  </div>
                </div>

                {hasDashboard && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 w-full text-slate-200 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-medium mb-2 transition-colors"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="p-4 border-b border-slate-700 flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 border-2 border-white/30 text-white py-3 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  <LogIn size={16} /> Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile CTA */}
            <div className="p-4">
              <Link
                href={authUser ? "/contact" : "/sign-up"}
                className="block text-center bg-red-700 hover:bg-red-600 text-white py-3 rounded font-semibold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get Free Consultation
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
