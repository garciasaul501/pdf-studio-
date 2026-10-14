import React, { useState } from 'react';
import { StorefrontSettings, PlanConfig, FaqItem, UserSession } from '../types/whop';
import { defaultTestimonials, defaultFaqs } from '../data/defaultConfig';
import { PdfToVideoTool } from './PdfToVideoTool';
import { 
  Check, Star, Shield, Zap, Sparkles, Video, ArrowRight, 
  HelpCircle, ChevronDown, ChevronUp, Lock, CheckCircle2,
  Clock, Award, Users, TrendingUp, Layers, Smartphone, Crown
} from 'lucide-react';

interface StorefrontViewProps {
  settings: StorefrontSettings;
  session?: UserSession | null;
  onOpenCheckout: (plan: PlanConfig) => void;
  onSwitchToGuide: () => void;
  onSwitchToAdmin?: () => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  settings,
  session,
  onOpenCheckout,
  onSwitchToGuide,
  onSwitchToAdmin
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const scrollToTool = () => {
    const el = document.getElementById('demo-studio');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing-plans');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0C0E14] text-slate-100 flex flex-col font-sans">
      {/* 1. Whop Top Browser Bar Simulation */}
      <div className="bg-[#090A0F] border-b border-white/5 py-2 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#FF6243] flex items-center justify-center font-black text-white text-[10px]">
              W
            </div>
            <span className="text-slate-400">Tienda verificada en</span>
            <span className="font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10 text-[11px]">
              https://{settings.subdomain}.whop.site
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3.5 h-3.5" /> Pagos Seguros Whop
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Entrega Digital Inmediata</span>
          </div>
        </div>
      </div>



      {/* 2. Main Storefront Navbar */}
      <header className="sticky top-0 z-40 bg-[#0C0E14]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-[#FF6243] flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
                {settings.storeName}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Whop Storefront Oficial
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
            <button onClick={scrollToTool} className="hover:text-white transition-colors cursor-pointer">
              Convertidor en Vivo
            </button>
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Cómo Funciona
            </a>
            <a href="#comparativa" className="hover:text-white transition-colors">
              Ventajas
            </a>
            <button onClick={scrollToPricing} className="hover:text-white transition-colors cursor-pointer">
              Precios Whop
            </button>
            <a href="#faqs" className="hover:text-white transition-colors">
              Preguntas
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenCheckout(settings.plans[1])}
              className="py-2 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Acceder Ahora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. High-Converting Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 overflow-hidden border-b border-white/5">
        {/* Subtle Ambient Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          {/* Quiet text kicker instead of static pill enclosure */}
          <div className="flex items-center justify-center gap-2 text-xs text-orange-400 font-semibold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>Convertidor Automatizado de IA para Creadores de Whop</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-normal">Actualizado 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]">
            {settings.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {settings.subheadline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={scrollToTool}
              className="py-3.5 px-6 bg-[#FF6243] hover:bg-[#ff5130] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{settings.primaryCtaText}</span>
            </button>

            <button
              onClick={scrollToPricing}
              className="py-3.5 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{settings.secondaryCtaText}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Trust and Social Proof Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-amber-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-white ml-1">4.9 / 5</span>
              <span className="text-slate-400">(1,240+ valoraciones)</span>
            </div>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-orange-400" /> Generación en menos de 60 segundos
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Garantía de {settings.guaranteeDays} días
            </span>
          </div>
        </div>
      </section>

      {/* 4. Live Interactive Product Demo Studio */}
      <section id="demo-studio" className="py-16 md:py-20 px-4 bg-[#090B10] border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Demostración Interactiva en Vivo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Pruébalo ahora mismo antes de suscribirte
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Experimenta el motor de conversión en tiempo real. Selecciona un documento o sube el tuyo para ver cómo la IA estructura el guion y habla con voz natural.
            </p>
          </div>

          {/* The Live Working Tool Container */}
          <div className="bg-[#10121A] rounded-3xl border border-white/10 shadow-2xl p-2 md:p-6">
            <PdfToVideoTool session={session} />
          </div>
        </div>
      </section>

      {/* 5. Before vs After Comparison Section */}
      <section id="comparativa" className="py-16 md:py-20 px-4 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              La Gran Transformación
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              ¿Por qué los PDFs ya no venden solos?
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              Nadie lee documentos de 30 páginas en el móvil. Los compradores en Whop buscan videos cortos y dinámicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-rose-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 tracking-wider uppercase">
                  El Método Tradicional (Baja Conversión)
                </span>
                <span className="text-xs text-rose-400">❌ Lento & Pesado</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                PDF Estático de 40 Páginas
              </h3>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Tasa de lectura menor al 12% por saturación de texto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Requiere 8 a 15 horas de edición manual en Premiere o CapCut.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>No se puede monetizar fácilmente en TikTok, Reels ni YouTube Shorts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Contratar un locutor profesional cuesta más de $50 por video.</span>
                </li>
              </ul>
            </div>

            {/* The PDF to Video AI Way */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-orange-500/10 to-transparent border border-orange-500/30 space-y-4 shadow-xl shadow-orange-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 tracking-wider uppercase">
                  Con Nuestra App en Whop (Alta Conversión)
                </span>
                <span className="text-xs text-emerald-400">✓ 10x Más Retención</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Videos Dinámicos & Lecciones Animadas
              </h3>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Más del 85% de retención de audiencia con subtítulos dinámicos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Generado en 60 segundos con 1 solo clic desde tu navegador.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Listos en formato vertical 9:16 y horizontal 16:9 para todas las redes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Voces neuronales realistas con acentos neutros sin coste adicional.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How it Works (3 Steps) */}
      <section id="como-funciona" className="py-16 md:py-20 px-4 bg-[#0A0C12] border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Flujo Sin Fricción
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Cómo funciona en 3 sencillos pasos
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Todo el proceso ocurre de manera automatizada en el servidor sin que toques una sola pista de edición.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Sube tu Archivo PDF',
                desc: 'Arrastra cualquier guía, presentación, ebook o notas. La IA analiza el texto y jerarquiza los puntos más importantes.',
                icon: Layers
              },
              {
                step: '02',
                title: 'La IA Crea el Guion y Diapositivas',
                desc: 'Genera un storyboard con transiciones dinámicas, locución neuronal ultrarrealista y subtítulos automáticos sincronizados.',
                icon: Sparkles
              },
              {
                step: '03',
                title: 'Descarga y Publica en Redes',
                desc: 'Exporta en alta definición (1080p o 4K) en formato vertical 9:16 o panorámico 16:9 listo para TikTok, YouTube o tu curso.',
                icon: Video
              }
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-orange-500/80">
                    {item.step}
                  </span>
                  <div className="p-2 rounded-xl bg-white/5 text-orange-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Whop Optimized Pricing Plans */}
      <section id="pricing-plans" className="py-20 px-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Precios Transparentes & Membresía Whop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Comienza hoy y escala tu producción de video
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Todos los planes incluyen acceso instantáneo en el portal de clientes de Whop, actualizaciones automáticas y garantía de devolución.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {settings.plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-[#1A1E2B] to-[#121520] border-2 border-orange-500 shadow-2xl shadow-orange-500/10'
                    : 'bg-[#12151F] border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF6243] text-white text-[10px] font-black tracking-wider uppercase py-1 px-3.5 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    {plan.originalPrice && (
                      <span className="text-xs line-through text-slate-500">
                        ${plan.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-6 min-h-[34px]">
                    {plan.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">${plan.price}</span>
                      <span className="text-xs text-slate-400">
                        {plan.period === 'único' ? ' pago único' : ` / ${plan.period}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Cobro seguro con Whop Payments
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Incluye:
                    </p>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenCheckout(plan)}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'bg-[#FF6243] hover:bg-[#ff5130] text-white shadow-lg shadow-orange-500/25'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{plan.cta}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <span>¿Tienes dudas sobre el volumen o licencias corporativas? Escríbenos directamente a través de Whop.</span>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-16 md:py-20 px-4 bg-[#090B10] border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Prueba Social en Whop
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Lo que opinan creadores e infoproductores
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Opiniones verificadas de miembros activos en Whop.com
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {defaultTestimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Resolvemos tus Dudas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Todo lo que necesitas saber antes de empezar en Whop
            </p>
          </div>

          <div className="space-y-3">
            {defaultFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-white hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-orange-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5 bg-black/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Sticky Bottom Conversion Bar */}
      <aside aria-label="Acceso y compra rápida" className="sticky bottom-0 z-30 bg-[#0F121B]/95 backdrop-blur-md border-t border-white/10 py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse hidden sm:block" />
            <div>
              <p className="text-xs font-bold text-white">
                ¿Listo para crear tu primer video a partir de un PDF?
              </p>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Únete a más de 1,200 creadores que automatizan su contenido con Whop.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToGuide}
              className="hidden sm:inline-flex py-2 px-3 text-xs text-slate-300 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              📖 Ver Guía de Configuración Whop
            </button>
            <button
              onClick={() => onOpenCheckout(settings.plans[1])}
              className="py-2.5 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Desbloquear Acceso ($39/mes)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-xs text-slate-500 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{settings.storeName}</span>
            <span>·</span>
            <span>https://{settings.subdomain}.whop.site</span>
          </div>
          <p>© {new Date().getFullYear()} Todos los derechos reservados. Pagos procesados por Whop Payments.</p>
        </div>
      </footer>
    </div>
  );
};
