import React from 'react';
import { Wind, ShieldCheck, Database, Cpu, FlaskConical } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function Header({ onOpenBenchmark }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-white/20">
            <Wind className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">AeroVent</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30">
                AI Filtered
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Car AC Vent Air Freshener Search Tool</p>
          </div>
        </div>

        {/* Status Indicators & Benchmark Button */}
        <div className="flex items-center gap-3">
          {/* Supabase Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
            isSupabaseConfigured 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
          }`}>
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isSupabaseConfigured ? 'Supabase Connected' : 'Local Offline Cache'}</span>
          </div>

          {/* AI Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Verification Active</span>
          </div>

          {/* 10+10 Dataset Benchmark Trigger */}
          <button
            onClick={onOpenBenchmark}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="View 10+10 Ground Truth AI Verification Benchmark"
          >
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Benchmark (10+10)</span>
          </button>
        </div>

      </div>
    </header>
  );
}
