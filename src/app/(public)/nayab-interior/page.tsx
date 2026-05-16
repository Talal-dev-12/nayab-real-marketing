import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: "Nayab Interior | Modern Interior Design Services in Pakistan",
  description: "Modern interior design solutions that transform spaces into stylish, functional luxury environments.",
  keywords: "Nayab Interior, Interior Designer Pakistan, Modern Interior Design, Luxury Home Interior",
};

export default function NayabInteriorPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-200">
      
      {/* 1. Elegant Minimalist Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <p className="text-emerald-800 font-medium tracking-[0.2em] uppercase text-sm mb-8">
            Curated Spaces for Modern Living
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-12 text-stone-900 max-w-5xl leading-tight">
            Artistry in <br className="hidden md:block" />
            <span className="italic font-serif text-emerald-900">Every Detail.</span>
          </h1>
          
          <div className="w-full relative h-[60vh] md:h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl mb-12">
             <Image
              src="/divisions/interior_banner.png"
              alt="Luxury Interior"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-between w-full max-w-5xl text-left">
            <p className="text-xl md:text-2xl font-light text-stone-500 max-w-xl leading-relaxed">
              We design environments that reflect your personality, balancing aesthetic elegance with everyday practicality.
            </p>
            <Link href="/contact" className="group flex items-center justify-between w-full md:w-auto gap-12 bg-emerald-900 text-white px-8 py-5 rounded-full font-medium hover:bg-emerald-950 transition-colors">
              <span>Consult a Designer</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Sticky Scrolling Section */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            
            {/* Left: Sticky Image Showcase */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-32 h-[50vh] lg:h-[70vh] rounded-[2rem] overflow-hidden order-2 lg:order-1">
               <Image
                src="/heroImages/3.avif"
                alt="Interior Services"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/10" />
            </div>

            {/* Right: Scrolling Content */}
            <div className="w-full lg:w-1/2 space-y-32 py-10 order-1 lg:order-2">
              {[
                { title: 'Bespoke Home Interiors', desc: 'From minimalist apartments to expansive luxury villas, we curate living spaces that provide ultimate comfort and breathtaking aesthetics.' },
                { title: 'Corporate Workspaces', desc: 'Productivity meets design. We create modern office environments that inspire creativity and impress your clients the moment they walk in.' },
                { title: '3D Visualization', desc: 'See your dream space before a single hammer is swung. Our photorealistic 3D renders allow you to perfect every detail of your design.' },
                { title: 'Furniture & Decor', desc: 'Sourcing the finest materials, custom furniture pieces, and elegant decor to add the perfect finishing touches to your environment.' }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-emerald-900/20 font-serif text-8xl absolute -top-12 -left-8 -z-10 select-none">
                    0{i+1}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-stone-900 mb-6 flex items-center gap-4">
                    <Sparkles className="text-emerald-600" size={24} /> {item.title}
                  </h2>
                  <p className="text-lg md:text-xl text-stone-500 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Transformation / Before-After Feel */}
      <section className="py-32 bg-stone-900 text-stone-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-light mb-16 font-serif italic text-emerald-100">
            Elevate your everyday.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden">
               <Image src="/heroImages/4.avif" alt="Detail 1" fill className="object-cover" />
            </div>
            <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden md:mt-24">
               <Image src="/heroImages/1.avif" alt="Detail 2" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
