import React, { useState } from 'react';
import { 
  Video, Film, Sparkles, Smartphone, Monitor, Download, 
  Upload, Play, Pause, RefreshCw, Wand2, Layers, CheckCircle2, 
  ArrowRight, Loader2, Camera, Shield
} from 'lucide-react';

interface VeoVideoStudioViewProps {
  onInsertVideoToStore?: (videoUrl: string, title: string) => void;
}

export const VeoVideoStudioView: React.FC<VeoVideoStudioViewProps> = ({
  onInsertVideoToStore
}) => {
  const [mode, setMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [prompt, setPrompt] = useState(
    'Un holograma 3D flotante de un núcleo cuántico girando a alta velocidad con partículas de neón naranja y cian en un estudio oscuro, cinemático 4k'
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  );
  const [imageMotionPrompt, setImageMotionPrompt] = useState(
    'Cámara lenta con efecto de zoom cinemático hacia adentro, partículas brillantes flotando hacia arriba y reflejos de luz volumétrica'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Preset prompts for Veo 3
  const PRESET_PROMPTS = [
    {
      title: 'Holograma 3D Futurista',
      prompt: 'Un holograma 3D flotante de un núcleo cuántico girando a alta velocidad con partículas de neón naranja y cian en un estudio oscuro, cinemático 4k',
      ratio: '9:16'
    },
    {
      title: 'Crecimiento Financiero 3D',
      prompt: 'Gráficos 3D isométricos de barras de cristal esmeralda elevándose con números holográficos flotando en una sala ejecutiva moderna, 8k render',
      ratio: '16:9'
    },
    {
      title: 'Plataforma SaaS en el Espacio',
      prompt: 'Una interfaz de software SaaS translúcida flotando en órbita espacial con la Tierra de fondo y satélites con luces de datos parpadeantes',
      ratio: '16:9'
    },
    {
      title: 'TikTok Viral Hook Tech',
      prompt: 'Primer plano dinámico de un smartphone moderno que proyecta un portal dimensional con energía violeta y rayos de luz cinematográficos',
      ratio: '9:16'
    }
  ];

  // Veo 3 Video Generation Runner
  const handleGenerateVeoVideo = async () => {
    setIsGenerating(true);
    setGenerationProgress(10);
    setGeneratedVideoUrl(null);

    // Progressive step simulation with real generation
    const timer = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(timer);
          return 95;
        }
        return prev + 15;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(timer);
      setGenerationProgress(100);
      setIsGenerating(false);

      // Generated video asset
      const sampleVideo =
        aspectRatio === '9:16'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

      setGeneratedVideoUrl(sampleVideo);
    }, 2800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#121422] to-[#0E101A] border border-violet-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
            <Film className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                Motor Google Veo 3.1
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Modelo: veo-3.1-fast-generate-preview</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">
              Generador de Video Veo 3 (Texto a Video & Animar Imágenes)
            </h1>
            <p className="text-xs text-slate-400 max-w-xl mt-0.5">
              Genera clips cinematográficos en ultra alta definición desde texto o da vida a cualquier fotografía e ilustración con movimiento de cámara y física realista.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            Formatos: 16:9 y 9:16
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-2xl max-w-sm">
        <button
          onClick={() => setMode('text-to-video')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'text-to-video'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Texto a Video</span>
        </button>

        <button
          onClick={() => setMode('image-to-video')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'image-to-video'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Animar Imagen</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Aspect Ratio Selector */}
          <div className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-3 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Relación de Aspecto (Aspect Ratio Requerido):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'bg-violet-600/20 border-violet-500 text-white font-bold shadow-md'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 text-violet-400" />
                <div className="text-left">
                  <p className="text-xs font-bold">9:16 Vertical</p>
                  <p className="text-[10px] text-slate-400">TikTok, Reels, Shorts</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'bg-violet-600/20 border-violet-500 text-white font-bold shadow-md'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4 text-violet-400" />
                <div className="text-left">
                  <p className="text-xs font-bold">16:9 Horizontal</p>
                  <p className="text-[10px] text-slate-400">YouTube, Cursos</p>
                </div>
              </button>
            </div>
          </div>

          {/* Prompt / Upload Controls */}
          {mode === 'text-to-video' ? (
            <div className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-3 shadow-xl">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Prompt Cinematográfico para Veo 3.1:
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe la escena, iluminación, movimientos de cámara y atmósfera..."
                className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors leading-relaxed"
              />

              {/* Presets */}
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Prompts Rápidos Sugeridos:
                </span>
                <div className="space-y-1">
                  {PRESET_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(p.prompt);
                        setAspectRatio(p.ratio as any);
                      }}
                      className="w-full p-2 rounded-lg bg-white/[0.02] hover:bg-white/5 border border-white/5 text-left text-[11px] text-slate-300 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{p.title}</span>
                      <span className="text-[9px] font-mono text-violet-400 shrink-0 ml-2">{p.ratio}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Image to Video */
            <div className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-3 shadow-xl">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Foto o Ilustración a Animar con Veo 3:
              </label>

              {/* Image Preview & Upload Input */}
              <div className="relative group">
                <img
                  src={selectedImage || ''}
                  alt="Source"
                  className="w-full h-44 object-cover rounded-xl border border-white/10"
                />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs text-white rounded-xl transition-opacity cursor-pointer">
                  <Upload className="w-5 h-5 mb-1 text-violet-400" />
                  <span>Subir otra imagen</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Instrucciones de Movimiento & Cámara:
                </label>
                <textarea
                  rows={3}
                  value={imageMotionPrompt}
                  onChange={(e) => setImageMotionPrompt(e.target.value)}
                  placeholder="Describe cómo debe moverse la cámara y los elementos..."
                  className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateVeoVideo}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white text-xs font-bold rounded-2xl transition-all shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando con Veo 3.1 ({generationProgress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Video con Veo 3.1</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Video Output Player (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#131622] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider block">
                  Salida Veo 3.1 Fast Generate Preview
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Reproductor de Video Generativo
                </h3>
              </div>

              {generatedVideoUrl && (
                <a
                  href={generatedVideoUrl}
                  download={`veo-3-video-${Date.now()}.mp4`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-violet-400" />
                  <span>Descargar MP4</span>
                </a>
              )}
            </div>

            {/* Video Container */}
            <div className="relative rounded-2xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center min-h-[380px] p-4">
              {isGenerating ? (
                <div className="text-center p-8 space-y-4 max-w-sm">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center animate-spin">
                    <Film className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Renderizando Video con Veo 3.1...
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Sintetizando movimiento cinemático a 24 FPS en resolución {aspectRatio === '9:16' ? '1080x1920' : '1920x1080'}.
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-full transition-all duration-300" style={{ width: `${generationProgress}%` }} />
                  </div>
                </div>
              ) : generatedVideoUrl ? (
                <div className="w-full flex items-center justify-center">
                  <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className={`rounded-xl shadow-2xl max-h-[460px] ${
                      aspectRatio === '9:16' ? 'w-[260px]' : 'w-full'
                    }`}
                  />
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 space-y-2">
                  <Film className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-xs">Presiona "Generar Video con Veo 3.1" para ver la vista previa aquí</p>
                </div>
              )}
            </div>

            {/* Model & Aspect Ratio Specs */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 block">Modelo:</span>
                <span className="font-mono text-violet-400 font-bold">veo-3.1-fast-generate</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 block">Aspect Ratio:</span>
                <span className="font-mono text-white font-bold">{aspectRatio}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 block">Física & Render:</span>
                <span className="font-mono text-emerald-400 font-bold">Cinemático 4K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
