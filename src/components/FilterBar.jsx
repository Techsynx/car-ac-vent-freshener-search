import React from 'react';
import { ArrowUpDown, Shield, Star, DollarSign, Store } from 'lucide-react';

export default function FilterBar({
  sortBy,
  setSortBy,
  selectedStore,
  setSelectedStore,
  stores,
  genuineOnly,
  setGenuineOnly
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
      
      {/* Sort By Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-brand-400" /> Sort by:
        </span>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-950 border border-slate-700/80 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 text-xs font-semibold cursor-pointer"
        >
          <option value="trust">Most Trustworthy First (AI Score)</option>
          <option value="rating">Highest Rated (★)</option>
          <option value="price-asc">Price: Low to High ($)</option>
          <option value="price-desc">Price: High to Low ($)</option>
          <option value="reviews">Most Reviews</option>
        </select>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Genuine Only Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={genuineOnly}
            onChange={(e) => setGenuineOnly(e.target.checked)}
            className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 focus:ring-offset-slate-950 h-3.5 w-3.5 bg-slate-950"
          />
          <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" />
            Verified Genuine Only (70+)
          </span>
        </label>

        {/* Store Selection */}
        {stores && stores.length > 1 && (
          <div className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 text-xs font-semibold cursor-pointer"
            >
              <option value="all">All Retailers</option>
              {stores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>

    </div>
  );
}
