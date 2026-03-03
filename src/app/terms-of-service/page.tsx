'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileText, ChevronRight, Scale, AlertTriangle, CheckCircle2, Ban, Globe, Mail } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: CheckCircle2,
    content: `By accessing and using the Nayab Real Marketing website (nayabrealestate.com), you accept and agree to be bound by these Terms of Service and our Privacy Policy. These terms apply to all visitors, users, and others who access or use our Service.

If you disagree with any part of these terms, please do not use our website. We reserve the right to update these terms at any time, and your continued use of the website following any changes constitutes your acceptance of the new terms.`,
  },
  {
    id: 'services',
    title: 'Our Services',
    icon: Globe,
    content: `Nayab Real Marketing provides real estate listing, marketing, and consultancy services in Pakistan. Our website facilitates:

• **Property Listings** – Browse residential, commercial, and plot listings across Pakistan
• **Agent Connection** – Connect with our verified real estate agents
• **Property Inquiries** – Submit inquiries and contact requests for properties
• **Market Information** – Access blog posts, market analysis, and real estate insights

We act as a real estate marketing intermediary. We do not guarantee the accuracy of all property information provided by third parties. All property transactions are subject to separate agreements between buyers, sellers, and agents.`,
  },
  {
    id: 'user-obligations',
    title: 'User Obligations',
    icon: Scale,
    content: `When using our services, you agree to:

• Provide accurate, truthful, and complete information when contacting us or submitting inquiries
• Use our services only for lawful purposes and in compliance with Pakistani law
• Not use our website to transmit spam, malware, or fraudulent communications
• Not attempt to gain unauthorized access to any part of our website or systems
• Not use automated tools to scrape, crawl, or copy content from our website without permission
• Respect the intellectual property rights of Nayab Real Marketing and third parties
• Not impersonate any person or entity or misrepresent your affiliation with any person or entity`,
  },
  {
    id: 'prohibited',
    title: 'Prohibited Activities',
    icon: Ban,
    content: `The following activities are strictly prohibited on our platform:

• Listing fraudulent properties or providing false property information
• Using our platform for money laundering or any illegal financial activities
• Harassing, threatening, or abusing our agents or staff
• Interfering with the proper working of the website
• Attempting to reverse engineer, decompile, or disassemble any part of our website
• Collecting or storing personal data about other users without their consent
• Using our service to conduct competing real estate marketing activities
• Violating any applicable local, national, or international laws or regulations`,
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer of Warranties',
    icon: AlertTriangle,
    content: `Our website and services are provided on an "as is" and "as available" basis without any warranties, either express or implied.

**We do not warrant that:**
• The website will be uninterrupted, error-free, or free from viruses
• Property listings are accurate, complete, or current at all times
• Our services will meet your specific requirements

**Property Information:**
Property prices, availability, and details are subject to change without notice. All property information should be independently verified before making any investment decisions. Nayab Real Marketing is not liable for any discrepancies in property information.

We strongly recommend consulting with a qualified legal or financial advisor before entering into any property transaction.`,
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    icon: Scale,
    content: `To the fullest extent permitted by applicable law, Nayab Real Marketing shall not be liable for:

• Any indirect, incidental, special, or consequential damages arising from use of our services
• Loss of profits, revenue, data, or business opportunities
• Damages resulting from unauthorized access to or alteration of your transmissions or data
• Any financial losses resulting from property transactions facilitated through our platform
• Errors or omissions in property listings provided by third-party agents

Our total liability to you for any claim arising from your use of our services shall not exceed the amount you have paid us for services in the twelve months preceding the claim.`,
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: FileText,
    content: `The content, design, layout, and all intellectual property on this website, including but not limited to text, graphics, logos, images, and software, are the property of Nayab Real Marketing or its licensors and are protected by Pakistani and international copyright laws.

You may not:
• Copy, reproduce, or distribute our content without written permission
• Use our logo, brand name, or trademarks without authorization
• Create derivative works based on our website content

You may share links to our website and use brief excerpts for non-commercial commentary, provided proper attribution is given.`,
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    icon: Scale,
    content: `These Terms of Service shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Karachi, Pakistan.

We encourage amicable resolution of disputes. If you have a complaint about our services, please first contact us directly at legal@nayabrealestate.com, and we will make every effort to resolve the matter promptly.`,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FileText size={32} className="text-red-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Terms of Service</h1>
          <p className="text-slate-400 text-lg mb-4">Please read these terms carefully before using our services</p>
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
          <span className="text-[#1a2e5a] font-medium">Terms of Service</span>
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
                <a href="#contact-terms" className="block text-sm text-slate-500 hover:text-red-700 py-1.5 border-l-2 border-transparent hover:border-red-700 pl-3 transition-all">
                  Contact & Questions
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Intro */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 mb-1">Important Notice</p>
                  <p className="text-amber-700 text-sm">
                    These Terms of Service constitute a legally binding agreement between you and Nayab Real Marketing. By using our website or services, you confirm that you are at least 18 years old and have the legal capacity to enter into this agreement.
                  </p>
                </div>
              </div>
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
                  <div className="text-slate-600 leading-relaxed text-sm">
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
                        return <p key={i} className="ml-4 mb-1.5 text-slate-600">{line}</p>;
                      }
                      return line.trim() ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                    })}
                  </div>
                </div>
              );
            })}

            {/* Contact */}
            <div id="contact-terms" className="bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] rounded-2xl p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-red-700/20 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-red-400" />
                </div>
                <h2 className="text-xl font-extrabold text-white">Questions About These Terms?</h2>
              </div>
              <p className="text-slate-400 mb-6 text-sm">
                If you have questions about these Terms of Service, please contact our legal team:
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Company', value: 'Nayab Real Marketing' },
                  { label: 'Legal', value: 'legal@nayabrealestate.com' },
                  { label: 'General', value: 'info@nayabrealestate.com' },
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
                <Link href="/privacy-policy" className="px-4 py-2 bg-red-700 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">
                  Privacy Policy
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
