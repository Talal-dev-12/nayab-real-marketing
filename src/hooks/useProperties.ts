import { useState, useEffect } from 'react';
import type { Property } from '@/types';

export interface PropertyFilters {
  type:      string; // 'all' | 'residential' | 'commercial' | 'office' | 'plot'
  priceType: string; // 'all' | 'sale' | 'rent'
  city:      string; // 'all' | 'Karachi' | 'Lahore' | 'Islamabad'
  search:    string;
  minPrice:  string;
  maxPrice:  string;
}

interface UsePropertiesOptions {
  filters:  PropertyFilters;
  page:     number;
  limit?:   number;
  featured?: boolean;
}

interface UsePropertiesReturn {
  properties: Property[];
  total:      number;
  totalPages: number;
  loading:    boolean;
  error:      string | null;
}

/**
 * Fetches properties from /api/properties with filters + server-side pagination.
 * Used on both the Properties listing page and the home page featured section.
 */
export function useProperties({
  filters,
  page,
  limit = 12,
  featured,
}: UsePropertiesOptions): UsePropertiesReturn {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      status: 'available',
      page:   page.toString(),
      limit:  limit.toString(),
    });

    if (featured)                    params.set('featured',  'true');
    if (filters.priceType !== 'all') params.set('priceType', filters.priceType);
    if (filters.type      !== 'all') params.set('type',      filters.type);
    if (filters.city      !== 'all') params.set('city',      filters.city);
    if (filters.search)              params.set('search',    filters.search);
    if (filters.minPrice)            params.set('minPrice',  filters.minPrice);
    if (filters.maxPrice)            params.set('maxPrice',  filters.maxPrice);

    fetch(`/api/properties?${params}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        if (cancelled) return;
        setProperties(d.properties ?? []);
        setTotal(d.total  ?? 0);
        setTotalPages(d.pages ?? 1);
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? 'Failed to load properties');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters, page, limit, featured]);

  return { properties, total, totalPages, loading, error };
}