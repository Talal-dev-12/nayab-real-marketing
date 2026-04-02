import { useState, useEffect } from 'react';
import type { Blog, AreaSummary, SchemeSummary } from '@/types';

interface UseBlogsReturn {
  blogs:   Blog[];
  areas:   AreaSummary[];
  schemes: SchemeSummary[];
  loading: boolean;
  error:   string | null;
}

/**
 * Fetches all published blogs (client-side filtering) plus taxonomy data
 * (areas + schemes) in a single parallel request pair.
 *
 * Filtering and pagination are done client-side because the blog dataset is
 * typically small (< 200 items) and we want instant filter responses without
 * extra round-trips.
 */
export function useBlogs(limit = 200): UseBlogsReturn {
  const [blogs,   setBlogs]   = useState<Blog[]>([]);
  const [areas,   setAreas]   = useState<AreaSummary[]>([]);
  const [schemes, setSchemes] = useState<SchemeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`/api/blogs?published=true&limit=${limit}`).then(r => {
        if (!r.ok) throw new Error(`Blogs: HTTP ${r.status}`);
        return r.json();
      }),
      fetch('/api/blogs/taxonomy').then(r => {
        if (!r.ok) throw new Error(`Taxonomy: HTTP ${r.status}`);
        return r.json();
      }),
    ])
      .then(([blogData, tax]) => {
        if (cancelled) return;
        setBlogs(blogData.blogs   ?? []);
        setAreas(tax.areas        ?? []);
        setSchemes(tax.schemes    ?? []);
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? 'Failed to load blogs');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [limit]);

  return { blogs, areas, schemes, loading, error };
}