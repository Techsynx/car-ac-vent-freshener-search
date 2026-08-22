import React, { useState } from 'react';
import { Search, RefreshCw, Sparkles, Filter, X, Flame } from 'lucide-react';

const PRESETS = [
  'Lavender Vent Clip',
  'Febreze Car Vent',
  'Little Trees Black Ice Vent',
  'Luxury Car AC Diffuser',
  'Vanilla Vent Air Freshener',
];

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  loading,
  forceFresh,
  setForceFresh,
  totalResults,
  filteredOutCount,
  status
}) {
  const [localInput, setLocalInput] = useState(query);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localInput.trim()) {
      setQuery(localInput);
      onSearch(localInput, forceFresh);
    }
  };

  const handlePresetClick = (preset) => {
    setLocalInput(preset);
    setQuery(preset);
    onSearch(preset, forceFresh);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Search car vent air fresheners (e.g. lavender, febreze, clip)..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-sm sm:text-base shadow-inner"
          />
          {localInput && (
            <button
              type="button"
              onClick={() => {
                setLocalInput('');
                setQuery('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Force Fresh Search Toggle (Feature 7) */}
          <button
            type="button"
            onClick={() => setForceFresh(!forceFresh)}
            className={`px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              forceFresh
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Bypass 24-hour cache and force a live fresh search"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${forceFresh ? 'text-amber-400 animate-spin-slow' : ''}`} />
            <span className="hidden sm:inline">Force Fresh</span>
          </button>

          {/* Search Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-initial px-6 py-3 bg-brand-600 hover:bg-brand-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-400" /> Popular:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className="text-xs px-3 py-1 rounded-full bg-slate-900/80 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-500/30 transition-all"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Search Meta Status Bar */}
      {status && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Results status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                status === 'live'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              }`}
            >
              ● {status === 'live' ? 'Live Internet Search' : 'Saved Offline Cache'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Showing <strong className="text-white">{totalResults}</strong> vent fresheners
            </span>
            {filteredOutCount > 0 && (
              <span className="text-rose-400/90 font-medium">
                ({filteredOutCount} non-vent items dropped by AI)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
