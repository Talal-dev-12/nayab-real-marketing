import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

const latestBlogs = [
  {
    id: '1',
    title: 'Top 5 Property Investment Areas in Karachi for 2024',
    excerpt: 'Discover the most profitable areas for real estate investment in Karachi, backed by market data and expert insights.',
    category: 'Investment',
    author: 'Ali Hassan',
    date: 'Nov 10, 2024',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
  },
  {
    id: '2',
    title: 'How to Buy Your First Home in Pakistan: A Complete Guide',
    excerpt: 'Step-by-step guide covering everything from budget planning and location selection to legal documentation and possession.',
    category: 'Guide',
    author: 'Sara Ahmed',
    date: 'Oct 28, 2024',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  },
  {
    id: '3',
    title: 'Real Estate Market Trends in Pakistan: Q4 2024 Report',
    excerpt: 'Our experts break down the latest trends, price movements, and demand patterns in Pakistan\'s major property markets.',
    category: 'Market Report',
    author: 'Ahmed Khan',
    date: 'Oct 15, 2024',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80',
  },
];

export default function LatestBlogs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4">
          <div>
            <p className="section-subtitle">Latest News</p>
            <h2 className="section-title mb-0">Blog & Insights</h2>
          </div>
          <Link href="/blog" className="btn-outline text-sm">
            View All Articles
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <article key={blog.id} className="card overflow-hidden group">
              {/* Image */}
              <div className="h-52 img-zoom-wrapper relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {blog.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {blog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} /> {blog.author}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-navy text-lg leading-tight mb-3 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                  {blog.excerpt}
                </p>

                <Link
                  href={`/blog/${blog.id}`}
                  className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-3 transition-all"
                >
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
