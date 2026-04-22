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
  Ruler,
  Hammer,
  Calculator,
  Map,
  TrendingUp,
  Sparkles,
  Clock,
} from "lucide-react";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nayabrealmarketing.official@gmail.com';

/* ─── Navigation Links ──────────────────────────────────────────────────── */
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/agents", label: "Agents" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/* ─── Tools Data ────────────────────────────────────────────────────────── */
const toolItems = [
  {
    href: "/tools/area-converter",
    label: "Area Converter",
    description: "Convert between Sq Ft, Marla, Kanal & more",
    icon: Ruler,
    color: "from-blue-500 to-cyan-400",
  },
  {
    href: "/tools/construction-calculator",
    label: "Construction Cost",
    description: "Estimate your construction budget instantly",
    icon: Hammer,
    color: "from-amber-500 to-orange-400",
  },
  {
    href: "/tools/loan-calculator",
    label: "Loan Calculator",
    description: "Calculate your monthly mortgage payments",
    icon: Calculator,
    color: "from-emerald-500 to-green-400",
  },
  {
    href: "/tools/property-index",
    label: "Property Index",
    description: "Browse indexed property rates by location",
    icon: Map,
    color: "from-violet-500 to-purple-400",
  },
  {
    href: "/tools/property-trends",
    label: "Property Trends",
    description: "View real-time market trends & analytics",
    icon: TrendingUp,
    color: "from-rose-500 to-pink-400",
  },
];

interface AuthUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Roles that have a dashboard portal
const DASHBOARD_ROLES = ["manager", "superadmin", "writer", "agent", "seller"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const toolsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── Scroll shadow ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Mark mounted so auth-dependent UI only renders on the client ────────
  useEffect(() => {
    setMounted(true);
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

  // ── Close dropdowns when clicking outside ────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        toolsRef.current &&
        !toolsRef.current.contains(e.target as Node)
      ) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Close mobile menu on route change ────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
    setMobileToolsOpen(false);
  }, [pathname]);

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

  // Until mounted, treat as guest so server & client HTML match
  const resolvedUser = mounted ? authUser : null;

  const initials =
    resolvedUser?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const hasDashboard =
    resolvedUser && DASHBOARD_ROLES.includes(resolvedUser.role);

  // ── Tools hover helpers (desktop) ─────────────────────────────────────────
  const handleToolsEnter = () => {
    if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
    setToolsOpen(true);
  };
  const handleToolsLeave = () => {
    toolsTimeoutRef.current = setTimeout(() => setToolsOpen(false), 200);
  };

  const isToolsActive = pathname.startsWith("/tools");

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="navbar-topbar">
        <div className="navbar-topbar-inner">
          <div className="navbar-topbar-left">
            <a href="tel:+923212869000" className="navbar-topbar-link">
              <Phone size={14} />
              <span>+92 321 2869000</span>
            </a>
            <span className="navbar-topbar-divider" />
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="navbar-topbar-link"
            >
              <Mail size={14} />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>
          <div className="navbar-topbar-right">
            <Clock size={14} />
            <span>Mon – Thu : 11 AM – 7 PM</span>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ─────────────────────────────────────────────────── */}
      <nav
        className={`navbar-main ${scrolled ? "navbar-scrolled" : ""}`}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <Image
              src={logo}
              alt="Nayab Real Marketing"
              width={200}
              height={60}
              className="navbar-logo-img"
              loading="eager"
            />
          </Link>

          {/* ── Desktop Menu ─────────────────────────────────────────── */}
          <div className="navbar-desktop-menu">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${pathname === link.href ? "navbar-link-active" : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ── Tools Dropdown ── */}
            <div
              ref={toolsRef}
              className="navbar-tools-wrapper"
              onMouseEnter={handleToolsEnter}
              onMouseLeave={handleToolsLeave}
            >
              <button
                className={`navbar-link navbar-tools-trigger ${isToolsActive ? "navbar-link-active" : ""
                  }`}
                onClick={() => setToolsOpen((o) => !o)}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
              >
                <Sparkles size={15} />
                Tools
                <ChevronDown
                  size={14}
                  className={`navbar-tools-chevron ${toolsOpen ? "navbar-tools-chevron-open" : ""}`}
                />
              </button>

              {/* Tools Mega Menu */}
              <div
                className={`navbar-tools-dropdown ${toolsOpen ? "navbar-tools-dropdown-open" : ""}`}
              >
                <div className="navbar-tools-dropdown-header">
                  <Sparkles size={16} className="navbar-tools-header-icon" />
                  <span>Real Estate Tools</span>
                </div>
                <div className="navbar-tools-grid">
                  {toolItems.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="navbar-tool-card"
                      onClick={() => setToolsOpen(false)}
                    >
                      <div className={`navbar-tool-icon bg-gradient-to-br ${tool.color}`}>
                        <tool.icon size={20} />
                      </div>
                      <div className="navbar-tool-info">
                        <span className="navbar-tool-label">{tool.label}</span>
                        <span className="navbar-tool-desc">
                          {tool.description}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={resolvedUser ? "/dashboard" : "/sign-up/seller"}
              className="navbar-cta"
            >
              <span className="navbar-cta-pulse" />
              Want to Sell?
            </Link>

            {/* ── Auth area ── */}
            {resolvedUser ? (
              /* Logged-in user avatar + dropdown */
              <div className="navbar-user-wrapper" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="navbar-user-btn"
                >
                  {resolvedUser.avatar ? (
                    <img
                      src={resolvedUser.avatar}
                      alt={resolvedUser.name}
                      className="navbar-user-avatar"
                    />
                  ) : (
                    <div className="navbar-user-initials">
                      {initials}
                    </div>
                  )}
                  <span className="navbar-user-name">
                    {resolvedUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`navbar-user-chevron ${dropdownOpen ? "navbar-user-chevron-open" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="navbar-user-dropdown">
                    {/* User info */}
                    <div className="navbar-user-dropdown-header">
                      <p className="navbar-user-dropdown-name">
                        {resolvedUser.name}
                      </p>
                      <p className="navbar-user-dropdown-email">
                        {resolvedUser.email}
                      </p>
                    </div>
                    {hasDashboard && (
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="navbar-user-dropdown-item"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="navbar-user-dropdown-item"
                    >
                      <User size={15} />
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="navbar-user-dropdown-item navbar-user-dropdown-logout"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest — Sign In button */
              <Link href="/sign-in" className="navbar-signin">
                <LogIn size={15} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Overlay ──────────────────────────────────────────────── */}
      <div
        className={`navbar-mobile-overlay ${mobileOpen ? "navbar-mobile-overlay-open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile Menu Panel ───────────────────────────────────────────── */}
      <div
        className={`navbar-mobile-panel ${mobileOpen ? "navbar-mobile-panel-open" : ""}`}
      >
        {/* Mobile Header */}
        <div className="navbar-mobile-header">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Image
              src={logo}
              alt="Nayab Real Marketing"
              width={140}
              height={42}
              className="h-10 w-auto"
            />
          </Link>
          <button
            className="navbar-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div className="navbar-mobile-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`navbar-mobile-link ${pathname === link.href ? "navbar-mobile-link-active" : ""
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Tools Accordion */}
          <button
            className={`navbar-mobile-link navbar-mobile-tools-trigger ${isToolsActive ? "navbar-mobile-link-active" : ""
              }`}
            onClick={() => setMobileToolsOpen((o) => !o)}
          >
            <span className="flex items-center gap-2">
              <Sparkles size={16} />
              Tools
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${mobileToolsOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {mobileToolsOpen && (
            <div className="navbar-mobile-tools-list">
              {toolItems.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileOpen(false)}
                  className="navbar-mobile-tool-item"
                >
                  <div className={`navbar-mobile-tool-icon bg-gradient-to-br ${tool.color}`}>
                    <tool.icon size={16} />
                  </div>
                  <div className="navbar-mobile-tool-info">
                    <span className="navbar-mobile-tool-label">
                      {tool.label}
                    </span>
                    <span className="navbar-mobile-tool-desc">
                      {tool.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Auth */}
        <div className="navbar-mobile-footer">
          {resolvedUser ? (
            <>
              <div className="navbar-mobile-user-info">
                {resolvedUser.avatar ? (
                  <img
                    src={resolvedUser.avatar}
                    alt={resolvedUser.name}
                    className="navbar-mobile-user-avatar"
                  />
                ) : (
                  <div className="navbar-mobile-user-initials">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="navbar-mobile-user-name">{resolvedUser.name}</p>
                  <p className="navbar-mobile-user-email">
                    {resolvedUser.email}
                  </p>
                </div>
              </div>

              {hasDashboard && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="navbar-mobile-action"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              )}

              <button onClick={handleLogout} className="navbar-mobile-logout">
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <div className="navbar-mobile-guest-actions">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="navbar-mobile-signin"
              >
                <LogIn size={16} />
                Sign In
              </Link>
              <Link
                href="/sign-up/seller"
                onClick={() => setMobileOpen(false)}
                className="navbar-mobile-cta"
              >
                Want to Sell?
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
