import React, { useState } from 'react';
import { PlanConfig } from '../types/whop';
import { X, CheckCircle, ShieldCheck, Lock, CreditCard, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface CheckoutModalProps {
  plan: PlanConfig | null;
  onClose: () => void;
  onSuccess: (plan: PlanConfig) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, onClose, onSuccess }) => {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!plan) return null;

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onSuccess(plan);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#12151E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Whop Header Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0F1118]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FF6243] flex items-center justify-center font-black text-white text-xs">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Checkout Seguro de Whop</span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verificado
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200">whop.com/checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'checkout' ? (
          <div className="p-6">
            {/* Order Summary */}
            <div className="p-4 mb-6 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-orange-400 tracking-wider uppercase">
                    Producto Digital Whop
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                    {plan.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-white">
                    ${plan.price}
                    <span className="text-xs text-slate-400 font-normal">
                      {plan.period === 'único' ? ' una vez' : `/${plan.period}`}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <span className="text-xs line-through text-slate-500">
                      ${plan.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Acceso Inmediato al Software:</span>
                  <span className="text-emerald-400 font-medium">Incluido</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Garantía de Devolución:</span>
                  <span className="text-slate-200">14 Días sin preguntas</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSimulatePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Correo electrónico para recibir acceso
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-400" />
                  <span>Whop Payments (Tarjeta, Apple Pay, Crypto)</span>
                </div>
                <span className="text-[11px] text-slate-500">Modo Demo Simulado</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Conectando con Whop...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pagar ${plan.price} y Obtener Acceso Inmediato</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Cifrado SSL 256-bit
                </span>
                <span>·</span>
                <span>Cancela cuando quieras</span>
                <span>·</span>
                <span>Powered by Whop</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              ¡Acceso Desbloqueado Exitosamente!
            </h3>
            <p className="text-sm text-slate-300 mb-6 max-w-sm mx-auto leading-relaxed">
              Tu membresía para <strong className="text-white">{plan.name}</strong> está activa en Whop. Tu licencia ha sido generada automáticamente.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-left mb-6 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cliente:</span>
                <span className="font-semibold text-white">{name || 'Creador VIP'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-white">{email || 'cliente@ejemplo.com'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Licencia Whop:</span>
                <span className="font-mono text-orange-400 font-bold">WHOP-PDF2VID-9842X</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
              >
                <span>Abrir Convertidor PDF a Video Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-500">
                Así es exactamente como tus compradores accederán a tu producto en Whop.com tras el checkout.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
