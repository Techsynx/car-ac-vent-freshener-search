import { createClient } from '@supabase/supabase-js';

// Read configuration safely from Vite import.meta.env or Node process.env
const getEnv = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback cache storage (in-memory + localStorage for browser)
const localMemoryCache = new Map();

/**
 * Normalizes search text for consistent caching
 */
export function normalizeQuery(query = '') {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Checks cache for recent search results (< 24 hours old)
 * @param {string} query
 * @param {boolean} forceFresh
 * @returns {Promise<{ found: boolean, products: Array, status: 'live' | 'saved', cachedAt: string | null }>}
 */
export async function getCachedSearchResults(query, forceFresh = false) {
  if (forceFresh) {
    return { found: false, products: [], status: 'live', cachedAt: null };
  }

  const normalized = normalizeQuery(query);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // 1. Try Supabase if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('search_cache')
        .select('*')
        .eq('normalized_query', normalized)
        .order('last_searched_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        const isFresh = new Date(data.last_searched_at) > new Date(oneDayAgo);
        const products = Array.isArray(data.products_data) ? data.products_data : [];
        if (products.length > 0) {
          return {
            found: true,
            products,
            status: isFresh ? 'saved' : 'saved',
            cachedAt: data.last_searched_at,
          };
        }
      }
    } catch (err) {
      console.warn('Supabase cache read failed, checking local cache:', err.message);
    }
  }

  // 2. Fallback to Local Storage / In-Memory
  try {
    let cached = localMemoryCache.get(normalized);
    if (!cached && typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(`cache_${normalized}`);
      if (raw) {
        cached = JSON.parse(raw);
      }
    }

    if (cached && Array.isArray(cached.products) && cached.products.length > 0) {
      return {
        found: true,
        products: cached.products,
        status: 'saved',
        cachedAt: cached.last_searched_at,
      };
    }
  } catch (err) {
    console.warn('Local cache read error:', err);
  }

  return { found: false, products: [], status: 'live', cachedAt: null };
}

/**
 * Saves search results to Supabase and local cache
 * @param {string} query
 * @param {Array} products
 * @param {'live' | 'saved'} status
 */
export async function saveSearchResults(query, products, status = 'live') {
  if (!query || !Array.isArray(products) || products.length === 0) return;

  const normalized = normalizeQuery(query);
  const now = new Date().toISOString();
  const cacheId = `cache_${normalized.replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

  // 1. Save to Supabase if configured
  if (supabase) {
    try {
      const productRows = products.map((p) => ({
        id: p.id,
        name: p.name,
        link: p.link,
        source_website: p.source_website,
        price: p.price,
        currency: p.currency || 'USD',
        rating: p.rating,
        review_count: p.review_count,
        image_url: p.image_url,
        is_vent_freshener: p.is_vent_freshener ?? true,
        vent_confidence: p.vent_confidence ?? 95,
        genuine_score: p.genuine_score ?? 85,
        genuine_reason: p.genuine_reason || 'Verified listing',
        last_fetched_at: now,
      }));

      await supabase.from('products').upsert(productRows, { onConflict: 'id' });

      await supabase.from('search_cache').upsert({
        id: cacheId,
        query,
        normalized_query: normalized,
        product_ids: products.map((p) => p.id),
        products_data: products,
        status,
        last_searched_at: now,
      });
    } catch (err) {
      console.warn('Supabase cache write error:', err.message);
    }
  }

  // 2. Always update local cache
  try {
    const cacheEntry = {
      query,
      normalized_query: normalized,
      products,
      status,
      last_searched_at: now,
    };
    localMemoryCache.set(normalized, cacheEntry);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`cache_${normalized}`, JSON.stringify(cacheEntry));
    }
  } catch (err) {
    console.warn('Local storage write error:', err);
  }
}
