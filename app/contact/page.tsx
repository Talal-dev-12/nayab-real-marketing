'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { getFromStorage, saveToStorage, STORAGE_KEYS, defaultMessages } from '@/lib/data';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messages = getFromStorage(STORAGE_KEYS.MESSAGES, defaultMessages);
    const newMsg = {
      id: Date.now().toString(),
      ...form,
      read: false,
      createdAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.MESSAGES, [newMsg, ...messages]);
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-[#1a2e5a] py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Contact Us</h1>
        <p className="text-slate-400">We're here to help you with all your real estate needs</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-[#1a2e5a] mb-6">Get In Touch</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Have questions about a property? Need investment advice? Our team of experts is ready to assist you. Reach out through any of the channels below.
            </p>
            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Office Address', content: 'Office 301, XYZ Plaza, Shahrah-e-Faisal, Karachi, Pakistan' },
                { icon: Phone, title: 'Phone', content: '+92-300-1234567\n+92-21-1234567 (Office)' },
                { icon: Mail, title: 'Email', content: 'info@nayabrealestate.com\nsupport@nayabrealestate.com' },
                { icon: Clock, title: 'Working Hours', content: 'Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: By Appointment' },
              ].map(({ icon: Icon, title, content }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a2e5a]">{title}</h4>
                    <p className="text-slate-500 text-sm whitespace-pre-line">{content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1a2e5a] mb-2">Message Sent!</h3>
                <p className="text-slate-500">Thank you for contacting us. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 btn-primary">Send Another Message</button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-[#1a2e5a] mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600 block mb-1">Full Name *</label>
                      <input
                        required
                        type="text"
                        className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600 block mb-1">Phone *</label>
                      <input
                        required
                        type="tel"
                        className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+92-300-XXXXXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">Email *</label>
                    <input
                      required
                      type="email"
                      className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">Subject *</label>
                    <input
                      required
                      type="text"
                      className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="Property inquiry, Investment advice..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">Message *</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us about your property requirements..."
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 text-base">
                    <Send size={18} /> Send Message
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
