import React from 'react';
import { StorefrontSettings, UserSession } from '../types/whop';
import { Store, Zap, BookOpen, PenTool, Crown, Lock, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: 'storefront' | 'tool' | 'guide' | 'copys' | 'admin';
  onSelectTab: (tab: 'storefront' | 'tool' | 'guide' | 'copys' | 'admin') => void;
  settings: StorefrontSettings;
  session: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab, 
  settings, 
  session, 
  onOpenLogin,
  onLogout 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#090B10] border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Brand & Context */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF6243] flex items-center justify-center font-black text-white text-sm shadow-md shadow-orange-500/20">
            W
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white tracking-tight">Whop Studio</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-xs font-mono text-orange-400 font-semibold hidden sm:inline">{settings.subdomain}.whop.site</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-xl overflow-x-auto">
          <button
            onClick={() => onSelectTab('storefront')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
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
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'tool'
                ? 'bg-[#FF6243] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Convertidor PDF</span>
            <span className="sm:hidden">App</span>
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'guide'
                ? 'bg-[#FF6243] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guía de Whop</span>
            <span className="sm:hidden">Guía</span>
          </button>

          <button
            onClick={() => onSelectTab('copys')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'copys'
                ? 'bg-[#FF6243] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copys</span>
          </button>

          {/* Admin Panel Tab */}
          {session?.role === 'admin' ? (
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'admin'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 bg-amber-500/10'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Panel Admin</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-amber-400 whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* User Session Right Status */}
        <div className="flex items-center gap-2">
          {session ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => onSelectTab('admin')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/15 border border-orange-500/30 text-xs cursor-pointer hover:bg-orange-500/25 transition-colors"
                title="Panel de Super Administrador"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-white text-[11px] font-bold max-w-[130px] sm:max-w-[180px] truncate">
                  {session.email}
                </span>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/20 px-1 py-0.2 rounded hidden sm:inline">
                  ILIMITADO
                </span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="py-1.5 px-3 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login Admin</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

