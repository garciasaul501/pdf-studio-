import React, { useState, useEffect, useRef } from 'react';
import { samplePdfOptions } from '../data/defaultConfig';
import { VideoScene } from '../types/whop';
import { 
  FileText, Play, Pause, RotateCcw, Volume2, VolumeX, Download, 
  Sparkles, CheckCircle2, Sliders, Smartphone, Monitor, Layers, 
  Share2, ArrowRight, Wand2, RefreshCw, FileUp, Copy, Check
} from 'lucide-react';

export const PdfToVideoTool: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState(samplePdfOptions[0]);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [voice, setVoice] = useState<'carlos' | 'sofia' | 'mateo' | 'elena'>('carlos');
  const [styleTheme, setStyleTheme] = useState<'dark' | 'emerald' | 'amber' | 'purple'>('dark');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [scenes, setScenes] = useState<VideoScene[]>(samplePdfOptions[0].scenes);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [elapsedSceneTime, setElapsedSceneTime] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sceneTimerRef = useRef<any>(null);

  // Stop speech when unmounting or changing scenes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (sceneTimerRef.current) clearInterval(sceneTimerRef.current);
    };
  }, []);

  const currentScene = scenes[currentSceneIdx] || scenes[0];

  // Speech synthesis runner
  const speakSceneNarration = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = voice === 'sofia' ? 1.08 : voice === 'mateo' ? 0.95 : 1.02;
    utterance.pitch = voice === 'sofia' ? 1.15 : voice === 'elena' ? 1.05 : 0.98;

    utterance.onend = () => {
      // Auto advance to next scene if playing
      if (isPlaying && currentSceneIdx < scenes.length - 1) {
        setCurrentSceneIdx((prev) => prev + 1);
      } else if (isPlaying && currentSceneIdx >= scenes.length - 1) {
        setIsPlaying(false);
        setCurrentSceneIdx(0);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle play/pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (sceneTimerRef.current) clearInterval(sceneTimerRef.current);
    } else {
      setIsPlaying(true);
      speakSceneNarration(currentScene.narration);
    }
  };

  // Change scene handler
  const handleSelectScene = (idx: number) => {
    setCurrentSceneIdx(idx);
    setElapsedSceneTime(0);
    if (isPlaying) {
      speakSceneNarration(scenes[idx].narration);
    }
  };

  // Trigger conversion simulation
  const handleProcessPdf = (pdfObj?: typeof samplePdfOptions[0], fileName?: string) => {
    setIsProcessing(true);
    setProcessingStep(0);
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const targetScenes = pdfObj ? pdfObj.scenes : [
      {
        id: 1,
        title: `Resumen Ejecutivo: ${fileName || 'Documento'}`,
        narration: 'Analizamos los puntos críticos del documento para extraer las conclusiones más accionables.',
        bulletPoints: ['Punto clave #1 extraído por IA', 'Segundo hallazgo con alto impacto', 'Llamada a la acción inmediata'],
        duration: 7,
        bgGradient: 'from-slate-900 via-neutral-900 to-black',
        accentColor: '#FF6243',
        iconName: 'Sparkles'
      },
      {
        id: 2,
        title: 'Estrategia & Resultados Proyectados',
        narration: 'Implementar este framework permite optimizar la retención y generar tracción sostenida.',
        bulletPoints: ['Incremento medible de efectividad', 'Automatización del flujo de trabajo', 'Paso a paso para ejecución'],
        duration: 8,
        bgGradient: 'from-orange-950/80 via-slate-900 to-black',
        accentColor: '#F97316',
        iconName: 'Zap'
      }
    ];

    const stepInterval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setIsProcessing(false);
          setScenes(targetScenes);
          setCurrentSceneIdx(0);
          return 3;
        }
        return prev + 1;
      });
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFile(file);
      handleProcessPdf(undefined, file.name);
    }
  };

  const handleSelectSample = (sample: typeof samplePdfOptions[0]) => {
    setSelectedSample(sample);
    setCustomFile(null);
    handleProcessPdf(sample);
  };

  // Copy full script
  const handleCopyScript = () => {
    const fullScript = scenes.map((s, i) => `[Escena ${i + 1}: ${s.title}]\nLocución: ${s.narration}\nPuntos clave:\n${s.bulletPoints.map(p => `• ${p}`).join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(fullScript);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const stepsLabels = [
    'Extrayendo texto y estructura del documento...',
    'Identificando ideas clave y resumiendo conceptos...',
    'Estructurando guion de alta retención para video...',
    'Generando diapositivas animadas y audio neuronal...'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Top Banner / Tool Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-orange-400 tracking-wider uppercase">
                Motor IA Integrado
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Listo para embeber en Whop</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Convertidor de PDF a Video AI
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Prueba la herramienta exacta que se comercializa en la tienda de Whop. Sube un PDF o selecciona un ejemplo para generar el video con voz en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleProcessPdf(selectedSample)}
              disabled={isProcessing}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-orange-400' : ''}`} />
              <span>Regenerar Video</span>
            </button>
            <button
              onClick={handleCopyScript}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Guion Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Guion TXT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Document Selector Card */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>1. Selecciona o Sube tu Documento PDF</span>
              </h3>
            </div>

            {/* Upload Area */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.txt,.docx"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-xl border-2 border-dashed border-white/15 hover:border-orange-500/50 bg-white/[0.02] hover:bg-orange-500/[0.03] text-center cursor-pointer transition-all group"
            >
              <FileUp className="w-7 h-7 mx-auto mb-2 text-slate-400 group-hover:text-orange-400 transition-colors" />
              <p className="text-xs font-semibold text-slate-200 group-hover:text-white">
                {customFile ? customFile.name : 'Haz clic para subir cualquier PDF'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PDF, TXT, Presentaciones o Guías de hasta 25MB
              </p>
            </div>

            {/* Preset Samples */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                O prueba con documentos de ejemplo:
              </p>
              <div className="space-y-2">
                {samplePdfOptions.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                      selectedSample.id === sample.id && !customFile
                        ? 'bg-orange-500/10 border-orange-500/40 text-white'
                        : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.04] hover:border-white/10'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white/5 text-orange-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{sample.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sample.summary}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                        <span>{sample.pages} páginas</span>
                        <span>·</span>
                        <span>{sample.scenes.length} escenas generadas</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Customization Settings */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-400" />
              <span>2. Formato & Locución de IA</span>
            </h3>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Relación de Aspecto del Video
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                    aspectRatio === '9:16'
                      ? 'bg-orange-500/10 border-orange-500 text-white font-medium shadow-sm'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-orange-400" />
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
                      ? 'bg-orange-500/10 border-orange-500 text-white font-medium shadow-sm'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-orange-400" />
                  <div className="text-left">
                    <p className="text-xs font-bold">16:9 Horizontal</p>
                    <p className="text-[10px] text-slate-400">YouTube, Cursos Whop</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Voz de Locución Neuronal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'carlos', name: 'Carlos', tone: 'Locutor Neutro' },
                  { id: 'sofia', name: 'Sofía', tone: 'Dinámica Reels' },
                  { id: 'mateo', name: 'Mateo', tone: 'Académico Pro' },
                  { id: 'elena', name: 'Elena', tone: 'Storytelling' }
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      voice === v.id
                        ? 'bg-white/10 border-orange-500/60 text-white'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className="text-xs font-bold">{v.name}</p>
                    <p className="text-[10px] text-slate-400">{v.tone}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Palette */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Paleta Visual de Diapositivas
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'dark', label: 'Dark Obsidian', color: 'bg-slate-800 border-orange-500' },
                  { id: 'emerald', label: 'Tech Emerald', color: 'bg-emerald-900 border-emerald-500' },
                  { id: 'amber', label: 'Golden Wealth', color: 'bg-amber-900 border-amber-500' },
                  { id: 'purple', label: 'Cyber Violet', color: 'bg-purple-900 border-purple-500' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setStyleTheme(t.id as any)}
                    className={`flex-1 py-2 px-1 text-[11px] rounded-lg border text-center transition-all cursor-pointer ${
                      styleTheme === t.id
                        ? 'bg-white/10 border-white text-white font-medium'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Video Canvas & Scene Storyboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Video Player Display Container */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Vista Previa del Video Generado
                </span>
                <span className="text-xs text-slate-500">
                  (Escena {currentSceneIdx + 1} de {scenes.length})
                </span>
              </div>

              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Activar voz' : 'Silenciar voz'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            {/* Video Frame Canvas Area */}
            <div className="relative flex items-center justify-center p-4 bg-black/60 rounded-xl overflow-hidden min-h-[380px] border border-white/5">
              {isProcessing ? (
                <div className="text-center p-8 max-w-sm space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center animate-spin">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Convirtiendo PDF a Video con IA...
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stepsLabels[processingStep]}
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-orange-500 h-full transition-all duration-500"
                      style={{ width: `${((processingStep + 1) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                /* The Rendered Scene Screen */
                <div
                  className={`relative transition-all duration-300 rounded-2xl border border-white/15 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden ${
                    aspectRatio === '9:16'
                      ? 'w-[290px] h-[480px] max-w-full'
                      : 'w-full max-w-[620px] h-[340px]'
                  } ${
                    styleTheme === 'emerald'
                      ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-black'
                      : styleTheme === 'amber'
                      ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-black'
                      : styleTheme === 'purple'
                      ? 'bg-gradient-to-br from-purple-950 via-slate-900 to-black'
                      : 'bg-gradient-to-br from-slate-900 via-[#10131d] to-black'
                  }`}
                >
                  {/* Subtle decorative glow */}
                  <div 
                    className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: currentScene.accentColor }}
                  />

                  {/* Scene Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentScene.accentColor }} />
                      <span>{selectedSample.name.split('.')[0]}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      0{currentSceneIdx + 1} / 0{scenes.length}
                    </span>
                  </div>

                  {/* Scene Content Center */}
                  <div className="relative z-10 my-auto space-y-3">
                    <h3 
                      className={`font-black text-white leading-tight tracking-tight ${
                        aspectRatio === '9:16' ? 'text-lg' : 'text-xl'
                      }`}
                    >
                      {currentScene.title}
                    </h3>

                    {/* Bullet Points with animations */}
                    <div className="space-y-1.5 pt-1">
                      {currentScene.bulletPoints.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2 text-xs text-slate-200 bg-black/30 p-2 rounded-lg border border-white/5 backdrop-blur-sm"
                        >
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0 mt-0.5"
                            style={{ color: currentScene.accentColor }}
                          />
                          <span className="leading-snug">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtitles Overlay Bar (Hormozi / Viral style subtitles) */}
                  <div className="relative z-10 mt-auto pt-2">
                    <div className="bg-black/80 border border-white/15 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-orange-400 font-bold uppercase mb-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Subtítulos en Tiempo Real</span>
                      </div>
                      <p className="text-xs font-bold text-yellow-300 italic leading-snug">
                        "{currentScene.narration}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Playback Controls Bar */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 bg-[#FF6243] hover:bg-[#ff5130] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-500/20"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pausar Narración</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Reproducir Video & Voz</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentSceneIdx(0);
                    if (isPlaying) speakSceneNarration(scenes[0].narration);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar desde la primera escena"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Scene Timeline Selector */}
              <div className="flex items-center gap-1.5">
                {scenes.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => handleSelectScene(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      currentSceneIdx === idx
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Escena {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Scene Editor & Script Breakdown */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Editor de Escena Activa (#{currentSceneIdx + 1})</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Modifica el texto para regenerar la voz en vivo
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Título de la Diapositiva
                </label>
                <input
                  type="text"
                  value={currentScene.title}
                  onChange={(e) => {
                    const newScenes = [...scenes];
                    newScenes[currentSceneIdx].title = e.target.value;
                    setScenes(newScenes);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Guion de Narración IA (Voz Neuronal)
                </label>
                <textarea
                  rows={2}
                  value={currentScene.narration}
                  onChange={(e) => {
                    const newScenes = [...scenes];
                    newScenes[currentSceneIdx].narration = e.target.value;
                    setScenes(newScenes);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sincronizado con Web Speech API
                </span>
                <button
                  onClick={() => speakSceneNarration(currentScene.narration)}
                  className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Escuchar esta escena sola
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
