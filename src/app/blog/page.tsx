'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogCard from '@/components/ui/BlogCard';
import { Search } from 'lucide-react';
import type { Blog } from '@/types';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetch('/api/blogs?published=true&limit=100')
      .then(r => r.json()).then(d => {
        const data = d.blogs ?? [];
        setBlogs(data);
        setFiltered(data);
      }).catch(() => {});
  }, []);

  useEffect(() => {
    let result = blogs;
    if (category !== 'all') result = result.filter((b: Blog) => b.category === category);
    if (search) result = result.filter((b: Blog) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, category, blogs]);

  const categories = ['all', ...Array.from(new Set(blogs.map((b: Blog) => b.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-[#1a2e5a] py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Blog & News</h1>
        <p className="text-slate-400">Real estate insights, tips, and market updates</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 items-center mb-10">
          <div className="flex items-center gap-2 border bg-white rounded-lg px-3 py-2 shadow-sm">
            <Search size={16} className="text-red-600" />
            <input type="text" placeholder="Search articles..." className="outline-none text-sm" onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${category === cat ? 'bg-red-700 text-white' : 'bg-white text-slate-600 hover:bg-gray-100 shadow-sm'}`}>
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No articles found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((b: Blog) => <BlogCard key={b._id} blog={b} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}