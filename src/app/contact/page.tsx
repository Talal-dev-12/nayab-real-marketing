"use client";
import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const COOLDOWN_MS = 60_000; // 1 minute between submissions

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState(""); // hidden field — bots fill this
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastSubmit = useRef<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Honeypot check — real users never fill this
    if (honeypot) return;

    // Client-side cooldown to prevent double-submit / rapid resubmit
    const now = Date.now();
    if (now - lastSubmit.current < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (now - lastSubmit.current)) / 1000);
      setError(`Please wait ${wait} seconds before sending another message.`);
      return;
    }

    // Basic length guards
    if (form.message.trim().length < 10) {
      setError("Message is too short. Please provide more detail.");
      return;
    }
    if (form.message.length > 2000) {
      setError("Message is too long (max 2000 characters).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle rate limit from server (429)
        if (res.status === 429) {
          setError("Too many messages sent. Please try again later.");
        } else {
          setError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      lastSubmit.current = Date.now();
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-[#1a2e5a] py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Contact Us</h1>
        <p className="text-slate-400">
          We're here to help you with all your real estate needs
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-[#1a2e5a] mb-6">
              Get In Touch
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Have questions about a property? Need investment advice? Our team
              of experts is ready to assist you. Reach out through any of the
              channels below.
            </p>
            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  title: "Office Address",
                  content: (
                    <Link
                      href="https://maps.app.goo.gl/rMSkd7VNLDXzUUnaA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-pre-line hover:text-red-700 transition"
                    >
                      B-22, Sector 15/A
                      {"\n"}KDA Employees Cooperative Housing Society
                      {"\n"}Gulzar-e-Hijri (Scheme 33)
                      {"\n"}Karachi – 75330, Pakistan
                    </Link>
                  ),
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: (
                    <div className="flex flex-col gap-1">
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
                  ),
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: (
                    <div className="flex flex-col gap-1">
                      <a
                        href="mailto:info@nayabrealestate.com"
                        className="hover:text-red-700 transition"
                      >
                        info@nayabrealestate.com
                      </a>
                      <a
                        href="mailto:support@nayabrealestate.com"
                        className="hover:text-red-700 transition"
                      >
                        support@nayabrealestate.com
                      </a>
                    </div>
                  ),
                },
                {
                  icon: Clock,
                  title: "Working Hours",
                  content: (
                    <p className="whitespace-pre-line">
                      Monday – Thursday: 9:00 AM – 7:00 PM
                      {"\n"}Friday: By Appointment Only
                      {"\n"}Saturday – Sunday: 9:00 AM – 7:00 PM
                    </p>
                  ),
                },
              ].map(({ icon: Icon, title, content }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>

                  <div className="text-slate-500 text-sm">
                    <h4 className="font-bold text-[#1a2e5a]">{title}</h4>
                    {content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle
                  size={60}
                  className="text-green-500 mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-[#1a2e5a] mb-2">
                  Message Sent!
                </h3>
                <p className="text-slate-500">
                  Thank you for contacting us. Our team will get back to you
                  within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-[#1a2e5a] mb-6">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot — hidden from real users, bots fill it */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600 block mb-1">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        maxLength={100}
                        className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600 block mb-1">
                        Phone *
                      </label>
                      <input
                        required
                        type="tel"
                        maxLength={20}
                        className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        placeholder="+92-300-XXXXXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      maxLength={150}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">
                      Subject *
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={200}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                      value={form.subject}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, subject: e.target.value }))
                      }
                      placeholder="Property inquiry, Investment advice..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">
                      Message *{" "}
                      <span className="text-slate-400 font-normal">
                        ({form.message.length}/2000)
                      </span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      maxLength={2000}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none"
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      placeholder="Tell us about your property requirements..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
