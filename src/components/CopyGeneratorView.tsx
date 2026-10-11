import React, { useState } from 'react';
import { StorefrontSettings } from '../types/whop';
import { Copy, Check, Sparkles, RefreshCw, Send, Layers, Mail, Flame, Download } from 'lucide-react';

interface CopyGeneratorViewProps {
  settings: StorefrontSettings;
  onUpdateSettings: (newSettings: Partial<StorefrontSettings>) => void;
}

export const CopyGeneratorView: React.FC<CopyGeneratorViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [niche, setNiche] = useState('Creadores de Contenido y Educadores');
  const [selectedFormat, setSelectedFormat] = useState<'reels' | 'cursos' | 'marketing'>('reels');

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Pre-calculated high-converting copies for Whop
  const whopProductDescriptionMarkdown = `# 🚀 ${settings.storeName}
**Convierte cualquier PDF en Videos de Alto Impacto en 60 Segundos**

¿Cansado de perder horas creando videos o viendo cómo nadie lee tus guías en PDF? Con nuestra herramienta de Inteligencia Artificial en Whop, conviertes cualquier documento en videos dinámicos con locución neuronal y subtítulos animados.

### ✨ ¿Qué obtienes al unirte?
* **Conversión Automatizada:** Sube tu PDF (presentaciones, resúmenes, libros o notas) y obtén escenas animadas al instante.
* **Locución Profesional Neuronal:** Voces humanas en español e inglés sin pagar costosos locutores ni micrófonos de estudio.
* **Subtítulos Virales Sincronizados:** Formato probado para retener la atención en TikTok, Reels, Shorts y cursos online.
* **Formato Dual 9:16 y 16:9:** Exporta videos verticales para redes sociales o panorámicos para YouTube y lecciones de Whop.
* **Acceso Inmediato:** Comienza a crear en menos de 2 minutos tras completar tu compra.

### 🛡️ Garantía Total de Satisfacción
Pruébalo durante ${settings.guaranteeDays} días. Si no ahorras al menos 10 horas de trabajo por semana, te devolvemos el 100% de tu dinero sin preguntas.`;

  const welcomeEmailCopy = `Asunto: ¡Bienvenido a ${settings.storeName}! Tu acceso ya está activo 🎉

Hola [Nombre del Miembro],

¡Muchas gracias por unirte a ${settings.storeName} a través de Whop!

Tu membresía ya está configurada y lista para usarse. Puedes acceder a la herramienta directamente desde tu portal de cliente en Whop:

👉 Enlace de Acceso Directo: https://${settings.subdomain}.whop.site/portal

Pasos rápidos para tu primer video:
1. Haz clic en el enlace superior o entra a tu cuenta de Whop.
2. Sube cualquier archivo PDF (o prueba con los ejemplos incluidos).
3. Selecciona tu voz favorita y relación de aspecto (9:16 o 16:9).
4. ¡Descarga tu video listo para publicar!

Si tienes cualquier duda, responde directamente a este correo o escríbenos a través del soporte de Whop.

¡A crear contenido viral!
El equipo de ${settings.storeName}`;

  const hooksForSocialMedia = [
    `🔥 "Encontré una herramienta en Whop que convierte cualquier PDF aburrido de 20 páginas en 5 videos de TikTok en 60 segundos..."`,
    `💡 "Deja de pasar horas editando en CapCut. Esta IA lee tu documento, escribe el guion y le pone voz profesional automáticamente."`,
    `📈 "Cómo pasé mis guías de finanzas de 0 lecturas a más de 100,000 reproducciones usando ${settings.subdomain}.whop.site."`,
    `⚡ "Si vendes cursos o infoproductos en Whop, necesitas ver esto antes de crear tu próxima lección."`
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Editor de Textos & Generador de Copywriting</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Textos de Alta Conversión Listos para Pegar en Whop
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl">
          Personaliza los datos de tu tienda y copia directamente los textos estructurados para el Storefront de Whop, emails de bienvenida y campañas de marketing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Ajustes Rápidos de la Tienda</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nombre de tu Producto / Tienda
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => onUpdateSettings({ storeName: e.target.value })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Subdominio Whop (.whop.site)
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={settings.subdomain}
                  onChange={(e) => onUpdateSettings({ subdomain: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-l-lg text-xs text-white focus:outline-none focus:border-orange-500"
                />
                <span className="bg-white/10 px-3 py-2 border border-l-0 border-white/10 rounded-r-lg text-xs text-slate-400">
                  .whop.site
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nicho Principal
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ej: Cursos Online, Finanzas, Marketing"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Días de Garantía de Devolución
              </label>
              <input
                type="number"
                value={settings.guaranteeDays}
                onChange={(e) => onUpdateSettings({ guaranteeDays: parseInt(e.target.value) || 14 })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Copy Outputs Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Whop Markdown Description */}
          <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Descripción del Producto para Whop Dashboard (Markdown)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Pega esto en la sección "Product Description" en el editor de Whop
                </p>
              </div>
              <button
                onClick={() => copyText(whopProductDescriptionMarkdown, 'desc')}
                className="py-1.5 px-3 bg-[#FF6243] hover:bg-[#ff5130] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {copiedKey === 'desc' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Markdown</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-black/50 border border-white/5 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {whopProductDescriptionMarkdown}
            </pre>
          </div>

          {/* Email Welcome */}
          <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>Email Automático de Bienvenida en Whop</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Configúralo en Whop Settings &gt; Emails para enviarlo tras la compra
                </p>
              </div>
              <button
                onClick={() => copyText(welcomeEmailCopy, 'email')}
                className="py-1.5 px-3 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Email</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-black/50 border border-white/5 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
              {welcomeEmailCopy}
            </pre>
          </div>

          {/* Viral Hooks */}
          <div className="p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Ganchos Virales (Hooks) para Promocionar tu Tienda</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Frases iniciales para videos de TikTok, Reels o hilos de X (Twitter)
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {hooksForSocialMedia.map((hook, hIdx) => (
                <div
                  key={hIdx}
                  className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-slate-200 flex items-center justify-between gap-3"
                >
                  <p className="italic">{hook}</p>
                  <button
                    onClick={() => copyText(hook, `hook-${hIdx}`)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                    title="Copiar gancho"
                  >
                    {copiedKey === `hook-${hIdx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
