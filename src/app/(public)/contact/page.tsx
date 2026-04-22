"use client";
import { useState, useEffect, useRef } from "react";
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
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nayabrealmarketing.official@gmail.com';

export default function ContactPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSubmit, setLastSubmit] = useState<number>(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setForm((f) => ({ ...f, name: u.name, email: u.email }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to send a message.");
      return;
    }
    setError("");

    if (honeypot) return;

    const now = Date.now();
    if (now - lastSubmit < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (now - lastSubmit)) / 1000);
      setError(`Please wait ${wait} seconds before sending another message.`);
      return;
    }

    if (form.message.trim().length < 10) {
      setError("Message is too short. Please provide more detail.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: form.subject,
          message: form.message,
          phone: form.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expired. Please sign in again.");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          setUser(null);
        } else if (res.status === 429) {
          setError("Too many messages sent. Please try again later.");
        } else {
          setError(data.error || "Something went wrong.");
        }
        return;
      }

      setLastSubmit(Date.now());
      setSubmitted(true);
      setForm({ ...form, subject: "", message: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="primary-gradient py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Contact Us</h1>
        <p className="text-slate-400">We&apos;re here to help you with all your real estate needs</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-[#1a2e5a] mb-6">Get In Touch</h2>
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
                      B-22, Sector 15/A<br />
                      KDA Employees Cooperative Housing Society<br />
                      Gulzar-e-Hijri (Scheme 33)<br />
                      Karachi – 75330, Pakistan
                    </Link>
                  ),
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: (
                    <div className="flex flex-col gap-1">
                      <a href="tel:+923212869000" className="hover:text-red-700 transition">+92 321 2869000 (Office)</a>
                      <a href="tel:+923113855950" className="hover:text-red-700 transition">+92 311 3855950 (Personal)</a>
                    </div>
                  ),
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: (
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-red-700 transition">{CONTACT_EMAIL}</a>
                      <a href="mailto:m.tallal.nadeem@gmail.com" className="hover:text-red-700 transition">m.tallal.nadeem@gmail.com</a>
                    </div>
                  ),
                },
                {
                  icon: Clock,
                  title: "Working Hours",
                  content: (
                    <p className="whitespace-pre-line">
                      Monday – Thursday: 11:00 AM – 7:00 PM<br />
                      Friday: By Appointment Only<br />
                      Saturday – Sunday: 11:00 AM – 7:00 PM
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

          {/* Form / Auth Prompt */}
          <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1a2e5a] mb-2">Message Sent!</h3>
                <p className="text-slate-500">Thank you for contacting us. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 btn-primary">Send Another Message</button>
              </div>
            ) : !user ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <Mail size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1a2e5a] mb-2">Login Required</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                  To ensure quality communications and prevent spam, please sign in to send us a message.
                </p>
                <Link href="/sign-in?redirect=/contact" className="bg-red-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">
                  Sign In to Continue
                </Link>
                <p className="mt-4 text-sm text-slate-400">
                  Don&apos;t have an account? <Link href="/sign-up" className="text-red-500 hover:underline">Register here</Link>
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#1a2e5a]">Send Message</h3>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="text-sm font-bold text-red-700">{user.name}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot */}
                  <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true">
                    <input type="text" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600 block mb-1">Full Name</label>
                      <input disabled className="w-full border rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-500" value={user.name} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600 block mb-1">Phone *</label>
                      <input required type="tel" className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+92 XXX XXXXXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">Email</label>
                    <input disabled className="w-full border rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-500" value={user.email} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">Subject *</label>
                    <input required type="text" className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Property inquiry..." />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">
                      Message * <span className="text-slate-400 font-normal">({form.message.length}/2000)</span>
                    </label>
                    <textarea required rows={5} className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your requirements..." />
                  </div>

                  {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>}

                  <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 text-base disabled:opacity-60">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
        {/* Google Maps */}
        <div className=" w-full lg:mt-0 mt-8">
          <h2 className="text-2xl font-extrabold text-[#1a2e5a] mb-4">Find Us</h2>
          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4535.701240947959!2d67.114488!3d24.9573671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34709058d9b51%3A0xf7362cb4ee87fca!2sNAYAB%20REAL%20MARKETING!5e1!3m2!1sen!2s!4v1774802864171!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
