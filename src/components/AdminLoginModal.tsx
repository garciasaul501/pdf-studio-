import React, { useState } from 'react';
import { UserSession } from '../types/whop';
import { 
  ShieldCheck, Lock, Mail, ArrowRight, X, Sparkles, 
  Crown, CheckCircle2, Key, Info, Zap
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [email, setEmail] = useState('garciassaul7@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      const isSuperAdminEmail = 
        email.toLowerCase().trim() === 'garciassaul7@gmail.com' ||
        email.toLowerCase().trim() === 'garciasaul501@gmail.com';

      const adminSession: UserSession = {
        email: email.trim(),
        name: isSuperAdminEmail ? 'Saul García (Super Admin)' : 'Administrador Whop',
        role: 'admin',
        isUnlimited: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        licenseKey: 'WHOP-MASTER-ADMIN-UNLIMITED-∞',
        createdAt: new Date().toISOString()
      };

      onLogin(adminSession);
      onClose();
    }, 600);
  };

  const handleQuickAdminAccess = () => {
    setEmail('garciassaul7@gmail.com');
    setPassword('••••••••');
    handleAdminLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#12151F] border border-orange-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E1018]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">Login Administrador</span>
                <span className="text-[10px] font-mono uppercase bg-orange-500/20 text-orange-400 px-1.5 py-0.2 rounded font-bold">
                  Ilimitado
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Portal de Gestión & Convertidor AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Quick Access Card for garciassaul7@gmail.com */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/30">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Acceso Rápido de Super Administrador</span>
                </div>
                <p className="text-xs text-white font-mono font-medium">
                  garciassaul7@gmail.com
                </p>
                <p className="text-[11px] text-slate-400">
                  Acceso total de por vida con videos y conversiones sin restricciones.
                </p>
              </div>
            </div>

            <button
              onClick={handleQuickAdminAccess}
              disabled={isLoading}
              className="mt-3.5 w-full py-2.5 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Entrar con 1-Clic como Administrador Ilimitado</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[#12151F] px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              O con credenciales
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Correo de Administrador</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="garciassaul7@gmail.com"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Contraseña / Clave de Acceso</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña o deja en blanco"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validando permisos de Administrador...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Iniciar Sesión como Administrador</span>
                </>
              )}
            </button>
          </form>

          {/* Admin Perks Summary */}
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Beneficios incluidos en tu cuenta:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Renders Ilimitados
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Gestión de Miembros
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Generador de Licencias
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Voces Ultra-HD Pro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
