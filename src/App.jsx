import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import TrustBadgeModal from './components/TrustBadgeModal';
import BenchmarkModal from './components/BenchmarkModal';
import EmptyState from './components/EmptyState';
import { searchVentAirFresheners } from './lib/searchService';
import { Wind, Sparkles, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('lavender vent air freshener');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('live'); // 'live' | 'saved'
  const [forceFresh, setForceFresh] = useState(false);
  const [filteredOutCount, setFilteredOutCount] = useState(0);

  // Sorting & Filter states
  const [sortBy, setSortBy] = useState('trust'); // 'trust' | 'rating' | 'price-asc' | 'price-desc' | 'reviews'
  const [selectedStore, setSelectedStore] = useState('all');
  const [genuineOnly, setGenuineOnly] = useState(false);

  // Modals
  const [inspectingProduct, setInspectingProduct] = useState(null);
  const [showBenchmark, setShowBenchmark] = useState(false);

  // Run search
  const handleSearch = async (searchQuery, isForce = false) => {
    setLoading(true);
    try {
      const res = await searchVentAirFresheners(searchQuery, isForce);
      setProducts(res.products || []);
      setStatus(res.status || 'live');
      setFilteredOutCount(res.filteredOut || 0);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial search on mount
  useEffect(() => {
    handleSearch('lavender vent air freshener', false);
  }, []);

  // Available store list
  const availableStores = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.source_website) set.add(p.source_website);
    });
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted products
  const displayProducts = useMemo(() => {
    let list = [...products];

    // Filter by store
    if (selectedStore !== 'all') {
      list = list.filter((p) => p.source_website === selectedStore);
    }

    // Filter by genuine threshold (>= 70)
    if (genuineOnly) {
      list = list.filter((p) => (p.genuine_score || 85) >= 70);
    }

    // Sort products
    switch (sortBy) {
      case 'trust':
        list.sort((a, b) => (b.genuine_score || 0) - (a.genuine_score || 0));
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-asc':
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'reviews':
        list.sort((a, b) => Number(b.review_count || 0) - Number(a.review_count || 0));
        break;
      default:
        break;
    }

    return list;
  }, [products, selectedStore, genuineOnly, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 selection:bg-brand-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Header onOpenBenchmark={() => setShowBenchmark(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <section className="text-center space-y-3 max-w-3xl mx-auto pt-2 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Category Filter & Trust Verification Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Find <span className="bg-gradient-to-r from-brand-400 to-emerald-300 bg-clip-text text-transparent">Real Car AC Vent</span> Air Fresheners
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Strictly filters out non-vent products (no sprays, no cans, no hanging trees) and analyzes listing genuineness using AI.
          </p>
        </section>

        {/* Search Controls */}
        <section>
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={(q, f) => handleSearch(q, f)}
            loading={loading}
            forceFresh={forceFresh}
            setForceFresh={setForceFresh}
            totalResults={displayProducts.length}
            filteredOutCount={filteredOutCount}
            status={status}
          />
        </section>

        {/* Filter and Sort Toolbar */}
        {products.length > 0 && (
          <section>
            <FilterBar
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              stores={availableStores}
              genuineOnly={genuineOnly}
              setGenuineOnly={setGenuineOnly}
            />
          </section>
        )}

        {/* Product Grid / Loading State */}
        <section>
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Searching & Verifying Listings...</h3>
                <p className="text-xs text-slate-400">Running AI category filter (Q1) and trust scoring (Q2)</p>
              </div>
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  status={status}
                  onInspectTrust={(p) => setInspectingProduct(p)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              query={query}
              onReset={() => {
                setQuery('lavender vent air freshener');
                handleSearch('lavender vent air freshener', false);
              }}
            />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-400 space-y-1">
        <p>© 2026 AeroVent Search Tool. Built with React, Supabase, Google Gemini Flash & Vercel.</p>
        <p className="text-[11px] text-slate-400">Section 10 GitHub repository: <strong className="text-slate-300">Techsynx/car-ac-vent-freshener-search</strong></p>
      </footer>

      {/* Modals */}
      {inspectingProduct && (
        <TrustBadgeModal
          product={inspectingProduct}
          onClose={() => setInspectingProduct(null)}
        />
      )}

      {showBenchmark && (
        <BenchmarkModal onClose={() => setShowBenchmark(false)} />
      )}

    </div>
  );
}
