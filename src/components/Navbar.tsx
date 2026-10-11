import React from 'react';
import { StorefrontSettings } from '../types/whop';
import { Store, Zap, BookOpen, PenTool, ExternalLink, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: 'storefront' | 'tool' | 'guide' | 'copys';
  onSelectTab: (tab: 'storefront' | 'tool' | 'guide' | 'copys') => void;
  settings: StorefrontSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, settings }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#090B10] border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF6243] flex items-center justify-center font-black text-white text-sm shadow-md shadow-orange-500/20">
            W
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white tracking-tight">Whop Studio</span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-mono text-orange-400 font-semibold">{settings.subdomain}.whop.site</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs (Segmented Control conforming to frontend design rules) */}
        <nav className="flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-xl">
          <button
            onClick={() => onSelectTab('storefront')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'storefront'
                ? 'bg-[#FF6243] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tienda Whop</span>
            <span className="sm:hidden">Tienda</span>
          </button>

          <button
            onClick={() => onSelectTab('tool')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'tool'
                ? 'bg-[#FF6243] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Convertidor PDF (App)</span>
            <span className="sm:hidden">App</span>
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'guide'
                ? 'bg-[#FF6243] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guía de Configuración</span>
            <span className="sm:hidden">Guía</span>
          </button>

          <button
            onClick={() => onSelectTab('copys')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'copys'
                ? 'bg-[#FF6243] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generador de Copys</span>
            <span className="sm:hidden">Copys</span>
          </button>
        </nav>

        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Inspirado en pdftovideo.whop.site</span>
        </div>
      </div>
    </header>
  );
};
