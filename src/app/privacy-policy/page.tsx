'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Shield, ChevronRight, Lock, Eye, Database, Bell, UserCheck, Mail } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    icon: Database,
    content: `We collect information you provide directly to us, such as when you:
    
• **Contact us** through our website contact form (name, email, phone number, message)
• **Inquire about properties** – we collect your name, contact details, and property preferences
• **Register or create an account** – we collect email and password for admin users
• **Browse our website** – we automatically collect browsing data, IP address, browser type, and pages visited

We do not collect sensitive personal data such as national ID numbers, financial account details, or health information.`,
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    icon: Eye,
    content: `We use the information we collect to:

• Respond to your inquiries and provide customer service
• Connect you with our real estate agents for property viewings
• Send you property listings and updates relevant to your search
• Improve our website, services, and user experience
• Analyze website traffic and usage patterns
• Comply with legal obligations

We will never sell, rent, or trade your personal information to third parties without your explicit consent.`,
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    content: `We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.

• All data transmitted through our website is encrypted using SSL/TLS technology
• Administrative access is protected by strong passwords and access controls
• We regularly review and update our security practices
• Your data is stored locally in your browser (localStorage) and is not transmitted to external servers unless you submit a contact form

However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    icon: Bell,
    content: `Our website uses cookies and similar tracking technologies to enhance your browsing experience.

**What are cookies?**
Cookies are small text files placed on your device that help us remember your preferences and analyze how you use our website.

**Types of cookies we use:**
• **Essential cookies** – Required for the website to function properly
• **Analytics cookies** – Help us understand how visitors interact with our website
• **Preference cookies** – Remember your settings and preferences

You can control cookies through your browser settings. Disabling cookies may affect some features of our website.`,
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: UserCheck,
    content: `You have the following rights regarding your personal data:

• **Right to Access** – You may request a copy of the personal information we hold about you
• **Right to Correction** – You may request that we correct inaccurate or incomplete information
• **Right to Deletion** – You may request that we delete your personal information, subject to legal obligations
• **Right to Opt-Out** – You may opt out of marketing communications at any time
• **Right to Withdraw Consent** – Where we process data based on consent, you may withdraw it at any time

To exercise any of these rights, please contact us using the details below.`,
  },
  {
    id: 'third-parties',
    title: 'Third-Party Services',
    icon: Shield,
    content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites and encourage you to review their privacy policies.

We may use third-party services such as:
• **Google Analytics** – For website traffic analysis (subject to Google's Privacy Policy)
• **Unsplash** – For stock photography displayed on our website
• **Hosting providers** – For website infrastructure

These services may collect information according to their own privacy policies.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield size={32} className="text-red-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-lg mb-4">How Nayab Real Marketing collects, uses, and protects your information</p>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <span>Last updated: January 2025</span>
            <span>•</span>
            <span>Effective: January 1, 2025</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-red-700">Home</Link>
          <ChevronRight size={14} />
          <span className="text-[#1a2e5a] font-medium">Privacy Policy</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
              <h3 className="font-extrabold text-[#1a2e5a] text-sm uppercase tracking-wide mb-4">Contents</h3>
              <nav className="space-y-1">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-slate-500 hover:text-red-700 py-1.5 border-l-2 border-transparent hover:border-red-700 pl-3 transition-all"
                  >
                    {s.title}
                  </a>
                ))}
                <a href="#contact" className="block text-sm text-slate-500 hover:text-red-700 py-1.5 border-l-2 border-transparent hover:border-red-700 pl-3 transition-all">
                  Contact Us
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Intro */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <p className="text-slate-600 leading-relaxed text-lg">
                At <strong className="text-[#1a2e5a]">Nayab Real Marketing</strong>, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                By using our website, you agree to the collection and use of information in accordance with this policy. If you disagree with any part of this policy, please discontinue use of our website.
              </p>
            </div>

            {/* Sections */}
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <div key={section.id} id={section.id} className="bg-white rounded-2xl shadow-sm p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-red-700" />
                    </div>
                    <h2 className="text-xl font-extrabold text-[#1a2e5a]">{section.title}</h2>
                  </div>
                  <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                    {section.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold text-[#1a2e5a] mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.includes('**')) {
                        return (
                          <p key={i} className="mb-1" dangerouslySetInnerHTML={{
                            __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#1a2e5a]">$1</strong>')
                          }} />
                        );
                      }
                      if (line.startsWith('•')) {
                        return <p key={i} className="ml-4 mb-1 text-slate-600">{line}</p>;
                      }
                      return line.trim() ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                    })}
                  </div>
                </div>
              );
            })}

            {/* Contact */}
            <div id="contact" className="bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] rounded-2xl p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-red-700/20 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-red-400" />
                </div>
                <h2 className="text-xl font-extrabold text-white">Contact Us About Privacy</h2>
              </div>
              <p className="text-slate-400 mb-6">
                If you have any questions about this Privacy Policy or how we handle your personal data, please reach out to us:
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Company', value: 'Nayab Real Marketing' },
                  { label: 'Email', value: 'privacy@nayabrealestate.com' },
                  { label: 'Phone', value: '+92-300-1234567' },
                  { label: 'Address', value: 'Karachi, Sindh, Pakistan' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 w-20 shrink-0">{label}:</span>
                    <span className="text-white font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">Also see our related policies:</p>
              <div className="flex gap-3">
                <Link href="/terms-of-service" className="px-4 py-2 bg-red-700 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/contact" className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
