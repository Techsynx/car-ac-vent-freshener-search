import React from 'react';
import { Star, ShieldCheck, ShieldAlert, ExternalLink, Info, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onInspectTrust, status }) {
  const isGenuine = product.genuine_score >= 70;
  const isLive = status === 'live';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Card Header & Product Image */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500';
            }}
          />

          {/* Top Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {/* Live / Saved Badge */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                isLive
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-blue-950/80 text-blue-300 border-blue-500/40'
              }`}
            >
              {isLive ? 'Live' : 'Saved'}
            </span>

            {/* AI Category Verification Badge */}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-950/80 text-slate-300 border border-slate-700/60 backdrop-blur-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-brand-400" /> Vent Mount
            </span>
          </div>

          {/* Retailer Source Tag */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/85 text-slate-200 border border-slate-700/60 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <ShoppingBag className="w-3 h-3 text-brand-400" />
            <span>{product.source_website || 'Retailer'}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-white line-clamp-2 leading-snug group-hover:text-brand-300 transition-colors">
            {product.name}
          </h3>

          {/* Price & Rating Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">USD</span>
            </div>

            {/* Star Rating & Review Count */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-0.5" />
                <span>{Number(product.rating || 4.5).toFixed(1)}</span>
              </div>
              <span className="text-slate-500">
                ({Number(product.review_count || 0).toLocaleString()})
              </span>
            </div>
          </div>

          {/* Trust Score & Genuineness Badge */}
          <div className="pt-2">
            <button
              onClick={() => onInspectTrust(product)}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                isGenuine
                  ? 'bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-950/40 hover:bg-amber-950/60 text-amber-300 border-amber-500/30'
              }`}
              title="Click to view AI Trust & Genuineness breakdown"
            >
              <div className="flex items-center gap-2">
                {isGenuine ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold">
                      {isGenuine ? 'Looks Genuine' : 'Not Sure / Caution'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 font-mono font-semibold">
                      {product.genuine_score || 85}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {product.genuine_reason || 'AI verified authentic listing'}
                  </p>
                </div>
              </div>

              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
            </button>
          </div>

        </div>
      </div>

      {/* Card Footer Action */}
      <div className="p-4 sm:p-5 pt-0">
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-slate-700/60 hover:border-brand-500 shadow-sm"
        >
          <span>View on {product.source_website || 'Store'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
