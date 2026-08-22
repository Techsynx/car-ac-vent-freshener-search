import React from 'react';
import { Wind, AlertCircle, RefreshCw } from 'lucide-react';

export default function EmptyState({ query, onReset }) {
  return (
    <div className="py-16 text-center max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
        <Wind className="w-8 h-8 text-slate-500" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white">No Vent Fresheners Found</h3>
        <p className="text-xs text-slate-400">
          Our AI filtered out non-vent products or no items matched "{query}". Try searching for lavender, vanilla, or febreze vent clips.
        </p>
      </div>
      <button
        onClick={onReset}
        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reset Search</span>
      </button>
    </div>
  );
}
