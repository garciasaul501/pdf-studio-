import React, { useState } from 'react';
import { UserSession } from '../types/whop';
import { 
  ShieldCheck, Lock, User, ArrowRight, X, Sparkles, 
  Crown, CheckCircle2, Key, Info, Zap, Eye, EyeOff
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
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    const inputUser = usernameOrEmail.trim().toLowerCase();
    const inputPass = password.trim();

    setTimeout(() => {
      setIsLoading(false);

      // Validate exact credentials: garciassaul7@gmail.com / garciasaul501@
      const isValidAdmin = 
        (inputUser === 'garciassaul7@gmail.com' || inputUser === 'garciasaul501@gmail.com' || inputUser === 'saul') &&
        inputPass === 'garciasaul501@';

      if (!isValidAdmin) {
        setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
        return;
      }

      // Create full unlimited account without revealing the email publicly
      const unlimitedSession: UserSession = {
        email: 'garciassaul7@gmail.com',
        name: 'Propietario VIP (Ilimitado)',
        role: 'admin',
        isUnlimited: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        licenseKey: 'WHOP-MASTER-UNLIMITED-∞',
        createdAt: new Date().toISOString()
      };

      if (rememberMe) {
        try {
          localStorage.setItem('whop_unlimited_auth', 'true');
        } catch {}
      }

      onLogin(unlimitedSession);
      onClose();
    }, 500);
  };

  // Quick 1-click verification with configured credentials
  const handleQuickMasterLogin = () => {
    setUsernameOrEmail('garciassaul7@gmail.com');
    setPassword('garciasaul501@');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const unlimitedSession: UserSession = {
        email: 'garciassaul7@gmail.com',
        name: 'Propietario VIP (Ilimitado)',
        role: 'admin',
        isUnlimited: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        licenseKey: 'WHOP-MASTER-UNLIMITED-∞',
        createdAt: new Date().toISOString()
      };
      onLogin(unlimitedSession);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#12151F] border border-orange-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E1018]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">Acceso Privado</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  Cuenta Sin Límites
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Portal de Convertidor & Gestión</p>
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
          {/* Quick Access Card without displaying raw email */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/30">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Acceso Directo Propietario</span>
              </div>
              <p className="text-xs text-white font-medium">
                Desbloquear Cuenta Ilimitada en 1 Clic
              </p>
              <p className="text-[11px] text-slate-400">
                Renders de video, exportaciones y voces neuronales 100% libres de costo.
              </p>
            </div>

            <button
              onClick={handleQuickMasterLogin}
              disabled={isLoading}
              className="mt-3.5 w-full py-2.5 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Entrar como Cuenta Sin Límites</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[#12151F] px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              O introduce tus credenciales
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Usuario o Correo</span>
              </label>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Ingresa tu usuario o correo"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contraseña</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Ocultar' : 'Ver'}</span>
                </button>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-orange-500 focus:ring-0"
                />
                <span>Mantener sesión iniciada</span>
              </label>
            </div>

            {error && (
              <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando cuenta...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Iniciar Sesión en Cuenta Sin Límites</span>
                </>
              )}
            </button>
          </form>

          {/* Discreet Perks */}
          <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Renders de Video ∞
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Imágenes IA Ilimitadas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
