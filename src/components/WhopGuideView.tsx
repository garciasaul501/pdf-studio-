import React, { useState } from 'react';
import { 
  CheckSquare, Square, ExternalLink, Copy, Check, Sparkles, 
  Layers, ShieldCheck, ArrowRight, DollarSign, Code, Zap,
  Compass, Laptop, Users, MessageSquare, AlertCircle
} from 'lucide-react';

export const WhopGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'estructura' | 'pasos' | 'tecnico' | 'checklist'>('estructura');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    'whop-account': true,
    'subdomain': true,
    'branding': false,
    'product-created': false,
    'pricing-tiers': false,
    'app-embed': false,
    'payments': false,
    'faq-added': false,
    'test-checkout': false,
    'whop-discover': false
  });

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const iframeSnippet = `<!-- Código para incrustar tu aplicación web en la pestaña "Software" de tu Whop -->
<iframe
  src="https://tu-app-de-video.com?token={USER_TOKEN}"
  title="PDF to Video AI Studio"
  width="100%"
  height="100%"
  style="border: none; min-height: 800px; border-radius: 12px;"
  allow="microphone; camera; clipboard-write;"
></iframe>`;

  const webhookSnippet = `// Endpoint en Node.js / Express para recibir pagos de Whop
import express from 'express';
const app = express();

app.post('/api/whop-webhook', express.json(), (req, res) => {
  const event = req.body;
  
  // Validar evento de Whop
  if (event.action === 'membership.went_valid') {
    const userEmail = event.data.user.email;
    const planName = event.data.plan.name;
    console.log(\`✅ Acceso concedido a \${userEmail} para el plan \${planName}\`);
    // Activa la licencia o agrega créditos ilimitados al usuario
  }
  
  res.status(200).json({ received: true });
});`;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Guía Maestra de Lanzamiento en Whop.com</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white">
          Cómo Configurar una Página como pdftovideo.whop.site
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Estructura estratégica, psicología de ventas, elementos visuales obligatorios y configuración técnica paso a paso para vender software y productos digitales con alta conversión en Whop.
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: 'estructura', label: '1. Estructura & Secciones Clave', icon: Layers },
            { id: 'pasos', label: '2. Configuración en Whop Paso a Paso', icon: Compass },
            { id: 'tecnico', label: '3. Integración Técnica & iFrame', icon: Code },
            { id: 'checklist', label: `4. Checklist de Lanzamiento (${progressPercent}%)`, icon: CheckSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FF6243] text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Estructura & Secciones Clave */}
      {activeTab === 'estructura' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-200 leading-relaxed">
            💡 <strong>La Regla de Oro en Whop:</strong> En tiendas como <code className="bg-orange-500/20 px-1 py-0.5 rounded text-white font-mono">pdftovideo.whop.site</code>, el 70% de las ventas ocurren porque el cliente puede <em>ver o probar el software de inmediato</em> en la misma página. Diseña tu página como una experiencia interactiva, no como un folleto estático.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seccion 1: Hero */}
            <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-orange-400">
                <span>SECCIÓN 1</span>
                <span>Prioridad Máxima</span>
              </div>
              <h3 className="text-lg font-bold text-white">Hero Section de Alto Impacto</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Los primeros 3 segundos deciden si el usuario compra o se va. Debe tener:
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Titular orientado a resultados:</strong> "Transforma cualquier PDF en videos virales en 60 segundos" (no hables de características, habla del beneficio tangible).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Subtítulo claro:</strong> Menciona el dolor que resuelves (ahorrar horas de edición) y los formatos que entregas (9:16 para TikTok y 16:9 para YouTube).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Llamada a la Acción Dual (CTA):</strong> Botón primario de prueba en vivo ("Probar Convertidor") + Botón secundario de compra directa ("Ver Planes desde $19/m").</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Trust Badges:</strong> Valoración de 4.9/5 estrellas, pagos procesados por Whop y garantía de 14 días.</span>
                </li>
              </ul>
            </div>

            {/* Seccion 2: Live Demo */}
            <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-orange-400">
                <span>SECCIÓN 2</span>
                <span>Factor #1 de Conversión</span>
              </div>
              <h3 className="text-lg font-bold text-white">Demostración Interactiva del Producto</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                En Whop, los compradores no quieren leer promesas vacías: quieren experimentar el resultado.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Sandbox en vivo:</strong> Un widget incrustado donde puedan subir o elegir un PDF de muestra y ver cómo la IA genera las escenas y el locutor habla.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Preview en dos formatos:</strong> Selector visual entre formato vertical 9:16 (TikTok/Reels) y panorámico 16:9.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Efecto "Aha Moment":</strong> En cuanto escuchan la voz y ven los subtítulos dinámicos sincronizados, entienden el valor instantáneamente.</span>
                </li>
              </ul>
            </div>

            {/* Seccion 3: Comparativa */}
            <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-orange-400">
                <span>SECCIÓN 3</span>
                <span>Derribar Indecisión</span>
              </div>
              <h3 className="text-lg font-bold text-white">Comparativa "Antes vs. Después"</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contrasta el costo y esfuerzo del método manual frente a tu solución con IA.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>El dolor actual:</strong> PDFs de 30 páginas que nadie lee, 10 horas de edición en Premiere, contratar locutores caros.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Tu herramienta:</strong> 1 clic, guion automático con retención del 85%, locutor neuronal incluido y publicación inmediata.</span>
                </li>
              </ul>
            </div>

            {/* Seccion 4: Precios Whop */}
            <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-orange-400">
                <span>SECCIÓN 4</span>
                <span>Psicología de Precios</span>
              </div>
              <h3 className="text-lg font-bold text-white">Tabla de Precios Optimizada para Whop</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Estructura de 3 niveles con "Efecto Señuelo" (Decoy Effect):
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">1.</span>
                  <span><strong>Nivel Entrada ($19/mes):</strong> Para quien tiene poco presupuesto (ej: 40 videos al mes).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">2.</span>
                  <span><strong>Nivel Pro Ilimitado ($39/mes):</strong> Con badge "MÁS POPULAR" y beneficios ilimitados. Este es tu plan estrella.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <span><strong>Licencia Lifetime ($99 - $149 pago único):</strong> Atrae a clientes que odian suscripciones y genera flujo de caja inmediato.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pasos en Whop.com */}
      {activeTab === 'pasos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-4">
            {[
              {
                step: 'Paso 1',
                title: 'Crear tu cuenta y Tienda en Whop.com',
                desc: 'Entra a Whop.com/sell y regístrate como creador. Al configurar tu "Whop", elige un slug atractivo para tu tienda, por ejemplo "pdftovideo" o el nombre de tu marca. Tu enlace público será tudominio.whop.site.',
                tips: 'Asegúrate de verificar tu identidad para activar Whop Payments de inmediato.'
              },
              {
                step: 'Paso 2',
                title: 'Personalizar el Storefront en Whop',
                desc: 'Ve a la pestaña "Storefront" en tu panel de control de Whop. Sube un Banner de 1920x1080px (tema oscuro con capturas de la herramienta) y un icono cuadrado de 500x500px.',
                tips: 'Redacta un titular directo como: "Convierte PDFs en Videos Virales con IA". Whop permite agregar videos de YouTube o Vimeo como portada.'
              },
              {
                step: 'Paso 3',
                title: 'Añadir la "Software App" o "Custom App"',
                desc: 'En el menú lateral de Whop, haz clic en "Add App" y selecciona "Software" o "Custom App (iFrame)". Aquí pegarás la URL de tu aplicación para que los miembros la usen adentro de su cuenta de Whop una vez compren.',
                tips: 'También puedes adjuntar guías en PDF o plantillas usando la app "Files" de Whop como bonus de regalo.'
              },
              {
                step: 'Paso 4',
                title: 'Configurar Planes & Whop Payments',
                desc: 'Crea tu producto y añade los 3 niveles de precios (Starter $19/m, Pro $39/m y Lifetime $99). Configura cobros en dólares estadounidenses y activa Apple Pay, Google Pay y pagos con tarjeta.',
                tips: 'Ofrece 14 días de garantía para reducir al mínimo la fricción de compra.'
              },
              {
                step: 'Paso 5',
                title: 'Activar el Programa de Afiliados en Whop',
                desc: 'Whop cuenta con un mercado de miles de afiliados. Ve a "Affiliates" y establece una comisión del 30% al 40% recurrente. Otros creadores recomendarán tu convertidor de PDF a Video a sus comunidades a cambio de comisión.',
                tips: 'Esto multiplica tus ventas de forma orgánica sin gastar en anuncios.'
              }
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                    {p.step}
                  </span>
                  <span className="text-xs text-slate-500">Panel de Whop.com</span>
                </div>
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                <div className="pt-2 text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tip Pro: {p.tips}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Integración Técnica & iFrame */}
      {activeTab === 'tecnico' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Método 1: Incrustación Directa por iFrame en Whop App
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pega este código en la sección de aplicaciones personalizadas de Whop para embeber el convertidor directamente en el portal del usuario:
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
                className="py-1.5 px-3 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSnippet === 'iframe' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Snippet</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-black/60 rounded-xl border border-white/10 text-xs font-mono text-orange-300 overflow-x-auto leading-relaxed">
              {iframeSnippet}
            </pre>
          </div>

          <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Método 2: Webhooks de Whop para Conceder Acceso
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cuando un cliente completa la compra en Whop, el webhook envía el evento para desbloquear créditos o credenciales automáticamente:
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(webhookSnippet, 'webhook')}
                className="py-1.5 px-3 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSnippet === 'webhook' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Snippet</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-black/60 rounded-xl border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {webhookSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Checklist de Lanzamiento en Whop</h3>
                <p className="text-xs text-slate-400">
                  Marca cada paso conforme lo completes en tu tienda de Whop.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-orange-400">{progressPercent}%</span>
                <p className="text-[10px] text-slate-400">Completado</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#FF6243] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="space-y-2 pt-2">
              {[
                { id: 'whop-account', label: 'Crear cuenta de vendedor en whop.com/sell' },
                { id: 'subdomain', label: 'Elegir subdominio personalizado (ej: pdftovideo.whop.site)' },
                { id: 'branding', label: 'Subir Banner 1920x1080 y logo oficial en alta resolución' },
                { id: 'product-created', label: 'Crear el producto digital "PDF to Video AI"' },
                { id: 'pricing-tiers', label: 'Definir 3 planes de precios ($19/mes, $39/mes y $99 Lifetime)' },
                { id: 'app-embed', label: 'Incrustar la app web o software en el portal de miembros' },
                { id: 'payments', label: 'Conectar cuenta bancaria en Whop Payments para recibir pagos' },
                { id: 'faq-added', label: 'Añadir 6 preguntas frecuentes para derribar objeciones' },
                { id: 'test-checkout', label: 'Realizar una compra de prueba en modo test en Whop' },
                { id: 'whop-discover', label: 'Solicitar listado en el marketplace de Whop Discover' }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    checklist[item.id]
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04]'
                  }`}
                >
                  {checklist[item.id] ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={`text-xs ${checklist[item.id] ? 'line-through text-slate-300' : ''}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
