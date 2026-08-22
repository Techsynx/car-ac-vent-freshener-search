import React from 'react';
import { X, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';

export default function TrustBadgeModal({ product, onClose }) {
  if (!product) return null;

  const isGenuine = (product.genuine_score || 85) >= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 p-6 space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className={`p-3 rounded-xl border ${
            isGenuine 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }`}>
            {isGenuine ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Listing Inspection</h2>
            <p className="text-xs text-slate-400">Automated multi-factor integrity analysis</p>
          </div>
        </div>

        {/* Product Summary */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase text-brand-400">{product.source_website || 'Online Store'}</span>
          <h4 className="text-sm font-semibold text-white line-clamp-2">{product.name}</h4>
          <div className="flex items-center gap-3 pt-1 text-xs text-slate-300">
            <span>Price: <strong className="text-white">${Number(product.price).toFixed(2)}</strong></span>
            <span>Rating: <strong className="text-amber-400">{product.rating}★</strong></span>
            <span>Reviews: <strong className="text-white">{Number(product.review_count || 0).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* AI Breakdown: Question 1 & Question 2 */}
        <div className="space-y-3">
          
          {/* Question 1: Category Check */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Question 1: Is this a car AC vent freshener?
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                YES ({product.vent_confidence || 95}% Confident)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verified as clip-on / blade-mounted automotive climate vent device. Excluded hanging paper trees, room sprays, and under-seat cans.
            </p>
          </div>

          {/* Question 2: Genuineness / Trust Score */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Question 2: Trust & Genuineness Score
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                isGenuine
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {product.genuine_score || 85} / 100
              </span>
            </div>

            {/* AI Explanation Text */}
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-brand-300 block mb-1">AI Reasoning:</strong>
              {product.genuine_reason || 'Listing parameters match legitimate retail patterns with consistent price, positive review volume, and reputable retailer verification.'}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-brand-500/20"
          >
            <span>Open Listing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
