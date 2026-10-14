import React, { useState, useEffect, useRef } from 'react';
import { samplePdfOptions } from '../data/defaultConfig';
import { VideoScene, UserSession } from '../types/whop';
import { parseFullPdf } from '../lib/pdfExtractor';
import { renderRealVideoFromScenes } from '../lib/videoRenderer';
import { 
  FileText, Play, Pause, RotateCcw, Volume2, VolumeX, Download, 
  Sparkles, CheckCircle2, Sliders, Smartphone, Monitor, Layers, 
  Share2, ArrowRight, Wand2, RefreshCw, FileUp, Copy, Check, 
  Crown, Video, Image as ImageIcon, Film, Loader2, Maximize2
} from 'lucide-react';

interface PdfToVideoToolProps {
  session?: UserSession | null;
}

export const PdfToVideoTool: React.FC<PdfToVideoToolProps> = ({ session }) => {
  const [selectedSample, setSelectedSample] = useState(samplePdfOptions[0]);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [voice, setVoice] = useState<'carlos' | 'sofia' | 'mateo' | 'elena'>('carlos');
  const [styleTheme, setStyleTheme] = useState<'dark' | 'emerald' | 'amber' | 'purple'>('dark');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Procesando documento...');
  const [processingProgress, setProcessingProgress] = useState(0);

  const [scenes, setScenes] = useState<VideoScene[]>(samplePdfOptions[0].scenes);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Real Video Export State
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportCurrentScene, setExportCurrentScene] = useState(1);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop speech synthesis when unmounting or changing scenes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
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
      if (isPlaying && currentSceneIdx < scenes.length - 1) {
        setCurrentSceneIdx((prev) => prev + 1);
      } else if (isPlaying && currentSceneIdx >= scenes.length - 1) {
        setIsPlaying(false);
        setCurrentSceneIdx(0);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlaying(true);
      speakSceneNarration(currentScene.narration);
    }
  };

  const handleSelectScene = (idx: number) => {
    setCurrentSceneIdx(idx);
    if (isPlaying) {
      speakSceneNarration(scenes[idx].narration);
    }
  };

  // Upload and parse full real PDF
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileName(file.name);
    setIsProcessing(true);
    setProcessingProgress(10);
    setProcessingStatus('Leyendo archivo PDF...');
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    try {
      const result = await parseFullPdf(file, (percent, status) => {
        setProcessingProgress(percent);
        setProcessingStatus(status);
      });

      setScenes(result.scenes);
      setCurrentSceneIdx(0);
    } catch (err) {
      console.error('Error processing PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectSample = (sample: typeof samplePdfOptions[0]) => {
    setSelectedSample(sample);
    setCustomFileName(null);
    setScenes(sample.scenes);
    setCurrentSceneIdx(0);
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Regenerate visual AI illustration for current scene
  const handleRegenerateImage = () => {
    const aiVisuals = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80'
    ];
    const randomImg = aiVisuals[Math.floor(Math.random() * aiVisuals.length)];
    const updated = [...scenes];
    updated[currentSceneIdx] = {
      ...updated[currentSceneIdx],
      imageUrl: randomImg
    };
    setScenes(updated);
  };

  // Render Real Video (Canvas -> MediaRecorder -> WebM/MP4)
  const handleExportFullVideo = async () => {
    setIsExportingVideo(true);
    setExportProgress(0);
    setExportCurrentScene(1);
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    try {
      const result = await renderRealVideoFromScenes(scenes, {
        aspectRatio,
        fps: 25,
        onProgress: (percent, currentScene, totalScenes) => {
          setExportProgress(percent);
          setExportCurrentScene(currentScene);
        }
      });

      setRenderedVideoUrl(result.videoUrl);

      // Trigger automatic file download
      const a = document.createElement('a');
      a.href = result.videoUrl;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error rendering video:', err);
      alert('Hubo un problema al exportar el video. Prueba con menos escenas o en resolución estándar.');
    } finally {
      setIsExportingVideo(false);
    }
  };

  const handleCopyScript = () => {
    const fullScript = scenes
      .map(
        (s, i) =>
          `[Escena ${i + 1}: ${s.title}]\nLocución: ${s.narration}\nPuntos clave:\n${s.bulletPoints
            .map((p) => `• ${p}`)
            .join('\n')}\nPrompt Imagen IA: ${s.imagePrompt || 'Arte conceptual'}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(fullScript);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Top Banner / Tool Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-orange-400 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Motor de Video con IA & Imágenes Generativas
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">PDF completo a Video</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Creador de Videos desde PDF Completo con Imágenes IA
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Sube tu PDF para extraer automáticamente todas las páginas, redactar el guion de retención, asignar ilustraciones temáticas de IA y exportar el video final renderizado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportFullVideo}
              disabled={isExportingVideo || isProcessing}
              className="py-2.5 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExportingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Renderizando ({exportProgress}%)...</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>Crear & Descargar Video Completo</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyScript}
              className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Guion Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Guion</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: PDF Input and Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Document Upload Card */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>1. Sube tu PDF Completo</span>
              </h3>
              {customFileName && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Cargado
                </span>
              )}
            </div>

            {/* Upload Area */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.txt"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-orange-500/60 bg-white/[0.02] hover:bg-orange-500/[0.04] text-center cursor-pointer transition-all group"
            >
              <FileUp className="w-8 h-8 mx-auto mb-2 text-slate-400 group-hover:text-orange-400 transition-colors" />
              <p className="text-xs font-bold text-slate-200 group-hover:text-white">
                {customFileName ? customFileName : 'Haz clic para subir tu PDF'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                La IA procesa el PDF completo, extrae todas las páginas y crea las escenas e imágenes.
              </p>
            </div>

            {/* Preset Samples */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                O prueba con documentos pre-cargados:
              </p>
              <div className="space-y-2">
                {samplePdfOptions.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                      selectedSample.id === sample.id && !customFileName
                        ? 'bg-orange-500/10 border-orange-500/40 text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.04]'
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

          {/* Video Format & Voice Controls */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-400" />
              <span>2. Formato & Locución IA</span>
            </h3>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Formato del Video
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
                    <p className="text-[10px] text-slate-400">YouTube, Cursos</p>
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
                  { id: 'carlos', name: 'Carlos', tone: 'Locutor Pro Español' },
                  { id: 'sofia', name: 'Sofía', tone: 'Dinámica Reels/TikTok' },
                  { id: 'mateo', name: 'Mateo', tone: 'Académico y Claro' },
                  { id: 'elena', name: 'Elena', tone: 'Storytelling Cálido' }
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
          </div>
        </div>

        {/* Right Column: Live Video Canvas & Scene Visuals (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Video Screen Container */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Reproductor de Video & Diapositiva IA
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  (Escena {currentSceneIdx + 1} de {scenes.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerateImage}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Cambiar imagen de la escena"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">Nueva Imagen IA</span>
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Activar voz' : 'Silenciar voz'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Video Canvas Visual Display */}
            <div className="relative flex items-center justify-center p-4 bg-black/80 rounded-2xl overflow-hidden min-h-[420px] border border-white/5">
              {isProcessing ? (
                <div className="text-center p-8 max-w-sm space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center animate-spin">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Procesando PDF Completo...
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {processingStatus}
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#FF6243] h-full transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                /* The Live Scene Screen with AI Background Image */
                <div
                  className={`relative transition-all duration-300 rounded-2xl border border-white/15 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden ${
                    aspectRatio === '9:16'
                      ? 'w-[310px] h-[520px] max-w-full'
                      : 'w-full max-w-[640px] h-[360px]'
                  }`}
                  style={{
                    backgroundImage: currentScene.imageUrl ? `url(${currentScene.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50 z-0 pointer-events-none" />

                  {/* Scene Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentScene.accentColor }} />
                      <span className="text-[11px] font-bold text-white tracking-wide uppercase drop-shadow">
                        PDF AI Visual · Escena {currentSceneIdx + 1}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-slate-200">
                      0{currentSceneIdx + 1} / 0{scenes.length}
                    </span>
                  </div>

                  {/* Scene Center Content */}
                  <div className="relative z-10 my-auto space-y-3 pt-2">
                    <h3 
                      className={`font-black text-white leading-tight tracking-tight drop-shadow-lg ${
                        aspectRatio === '9:16' ? 'text-lg' : 'text-xl'
                      }`}
                    >
                      {currentScene.title}
                    </h3>

                    {/* Bullet Points */}
                    <div className="space-y-1.5 pt-1">
                      {currentScene.bulletPoints.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2 text-xs text-slate-100 bg-black/60 p-2.5 rounded-xl border border-white/10 backdrop-blur-md shadow-md"
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

                  {/* Subtitles Overlay Bar (Karaoke style) */}
                  <div className="relative z-10 mt-auto pt-2">
                    <div className="bg-black/85 border border-white/20 px-3 py-2 rounded-xl backdrop-blur-md shadow-xl text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[9px] text-orange-400 font-bold uppercase mb-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Locución y Subtítulos Dinámicos</span>
                      </div>
                      <p className="text-xs font-bold text-yellow-300 italic leading-snug">
                        "{currentScene.narration}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Playback & Scene Controls */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 bg-[#FF6243] hover:bg-[#ff5130] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-500/20"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Reproducir Video</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentSceneIdx(0);
                    if (isPlaying) speakSceneNarration(scenes[0].narration);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar al inicio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleExportFullVideo}
                  disabled={isExportingVideo}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Video Renderizado</span>
                </button>
              </div>

              {/* Scene Timeline Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
                {scenes.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => handleSelectScene(idx)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
                      currentSceneIdx === idx
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    E{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scene Prompt & Visual Details */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-orange-400" />
                <span>Imagen Generada por IA (Escena #{currentSceneIdx + 1})</span>
              </h3>
              <button
                onClick={handleRegenerateImage}
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generar otra imagen</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono bg-black/40 p-3 rounded-xl border border-white/5">
              "{currentScene.imagePrompt || `Visual conceptual cinematográfico para: ${currentScene.title}`}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Resolución de imagen: Ultra HD 8K Concept</span>
              <span className="text-emerald-400 font-medium">✓ Sincronizado en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Export Overlay Modal */}
      {isExportingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#121520] border border-orange-500/40 rounded-3xl p-8 w-full max-w-md text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center animate-spin">
              <Film className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                Renderizando Video Completo...
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Generando fotogramas en alta resolución con imágenes IA, animaciones y subtítulos sincronizados.
              </p>
            </div>

            {/* Progress Display */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Escena {exportCurrentScene} de {scenes.length}</span>
                <span className="text-orange-400 font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#FF6243] h-full transition-all duration-200"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              El archivo se descargará automáticamente a tu equipo al completar el 100%.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
