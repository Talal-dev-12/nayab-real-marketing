import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  background?: string;
}

export default function PageHeader({ title, breadcrumbs, background }: PageHeaderProps) {
  return (
    <section
      className="relative py-20 flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10,22,40,0.7), rgba(10,22,40,0.8)), url('${
          background || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
        }')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {breadcrumbs && (
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight size={14} className="text-gray-500" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
