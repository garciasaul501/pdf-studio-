import React, { useState, useEffect, useRef } from 'react';
import { samplePdfOptions } from '../data/defaultConfig';
import { VideoScene, UserSession, PresenterAvatar, VisualStyle3D } from '../types/whop';
import { AI_PRESENTERS, MODERN_3D_STYLES } from '../data/avatars';
import { parseFullPdf } from '../lib/pdfExtractor';
import { renderRealVideoFromScenes } from '../lib/videoRenderer';
import { recreateScriptWithFramework, processAssistantInstruction, AssistantMessage, ScriptFramework } from '../lib/scriptAssistant';
import { TalkingAvatarPresenter } from './TalkingAvatarPresenter';
import { 
  FileText, Play, Pause, RotateCcw, Volume2, VolumeX, Download, 
  Sparkles, CheckCircle2, Sliders, Smartphone, Monitor, Layers, 
  Share2, ArrowRight, Wand2, RefreshCw, FileUp, Copy, Check, 
  Crown, Video, Image as ImageIcon, Film, Loader2, Bot, MessageSquare,
  UserCheck, Send, Zap, ChevronRight, Palette
} from 'lucide-react';

interface PdfToVideoToolProps {
  session?: UserSession | null;
}

export const PdfToVideoTool: React.FC<PdfToVideoToolProps> = ({ session }) => {
  const [selectedSample, setSelectedSample] = useState(samplePdfOptions[0]);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  
  // Presenter & Voice State
  const [currentPresenter, setCurrentPresenter] = useState<PresenterAvatar>(AI_PRESENTERS[0]);
  const [includeAvatarInVideo, setIncludeAvatarInVideo] = useState(true);
  
  // 3D Visual Style State
  const [visualStyle3D, setVisualStyle3D] = useState<VisualStyle3D>('3d-cyberneon');

  // PDF Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Procesando documento...');
  const [processingProgress, setProcessingProgress] = useState(0);

  // Scenes & Playback
  const [scenes, setScenes] = useState<VideoScene[]>(samplePdfOptions[0].scenes);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // AI Assistant Chat State
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: '¡Hola! Soy tu Asistente y Director de Video con IA. Puedo recrear tu guion para hacerlo viral, optimizar la locución o generar imágenes 3D de alto impacto para todo tu PDF. ¿En qué estilo te gustaría enfocar el video?',
      timestamp: 'Ahora'
    }
  ]);

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

  // Speech synthesis runner with the selected presenter's voice
  const speakSceneNarration = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    
    // Customize tone by presenter
    if (currentPresenter.voiceId === 'sofia') {
      utterance.rate = 1.08;
      utterance.pitch = 1.15;
    } else if (currentPresenter.voiceId === 'mateo') {
      utterance.rate = 0.95;
      utterance.pitch = 0.92;
    } else if (currentPresenter.voiceId === 'elena') {
      utterance.rate = 1.02;
      utterance.pitch = 1.06;
    } else {
      // Carlos
      utterance.rate = 1.0;
      utterance.pitch = 0.98;
    }

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
    setProcessingStatus('Leyendo archivo PDF completo...');
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    try {
      const result = await parseFullPdf(file, (percent, status) => {
        setProcessingProgress(percent);
        setProcessingStatus(status);
      });

      // Apply initial 3D style
      const with3D = recreateScriptWithFramework(result.scenes, 'viral-reels', visualStyle3D);
      setScenes(with3D);
      setCurrentSceneIdx(0);

      // Add assistant message
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          sender: 'ai',
          text: `He analizado "${file.name}" (${result.totalPages} páginas). Extraje el contenido completo y generé ${with3D.length} escenas con guion narrativo e imágenes 3D listas para tu avatar.`,
          timestamp: 'Ahora'
        }
      ]);
    } catch (err) {
      console.error('Error processing PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectSample = (sample: typeof samplePdfOptions[0]) => {
    setSelectedSample(sample);
    setCustomFileName(null);
    const with3D = recreateScriptWithFramework(sample.scenes, 'viral-reels', visualStyle3D);
    setScenes(with3D);
    setCurrentSceneIdx(0);
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Switch 3D visual style across all scenes
  const handleChange3DStyle = (styleId: VisualStyle3D) => {
    setVisualStyle3D(styleId);
    const styleObj = MODERN_3D_STYLES.find((s) => s.id === styleId) || MODERN_3D_STYLES[0];
    const updated = scenes.map((s, idx) => ({
      ...s,
      style3D: styleId,
      imageUrl: styleObj.sampleImages[idx % styleObj.sampleImages.length],
      imagePrompt: `3D modern illustration of ${s.title}, ${styleObj.description}, 8k render, cinematic lighting`
    }));
    setScenes(updated);
  };

  // Recreate script using a proven framework
  const handleRecreateWithFramework = (framework: ScriptFramework) => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const updated = recreateScriptWithFramework(scenes, framework, visualStyle3D);
    setScenes(updated);
    setCurrentSceneIdx(0);

    const labels: Record<ScriptFramework, string> = {
      'viral-reels': 'Viral Hook para TikTok & Reels',
      'pitch-deck': 'Pitch Deck Ejecutivo B2B',
      'masterclass': 'Masterclass Educativa Didáctica',
      'direct-sales': 'Venta de Alto Impacto'
    };

    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text: `¡Guion recreado exitosamente con el framework "${labels[framework]}"! He adaptado los ganchos iniciales, la cadencia y las imágenes 3D de todas las escenas.`,
        timestamp: 'Ahora'
      }
    ]);
  };

  // Send instruction to AI Assistant
  const handleSendAssistantInstruction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;

    const userText = assistantInput;
    setAssistantInput('');
    setIsAssistantThinking(true);

    const userMsg: AssistantMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Ahora'
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const { updatedScenes, responseText } = await processAssistantInstruction(userText, scenes, visualStyle3D);
      setScenes(updatedScenes);

      const aiMsg: AssistantMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: 'Ahora'
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Assistant error:', err);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  // Regenerate 3D image for active scene
  const handleRegenerate3DImage = () => {
    const styleObj = MODERN_3D_STYLES.find((s) => s.id === visualStyle3D) || MODERN_3D_STYLES[0];
    const randomImg = styleObj.sampleImages[Math.floor(Math.random() * styleObj.sampleImages.length)];
    const updated = [...scenes];
    updated[currentSceneIdx] = {
      ...updated[currentSceneIdx],
      imageUrl: randomImg
    };
    setScenes(updated);
  };

  // Render Real Video with Talking Avatar and 3D Visuals
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
        presenter: currentPresenter,
        includeAvatar: includeAvatarInVideo,
        visualStyle: visualStyle3D,
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
      alert('Hubo un inconveniente al renderizar el video. Por favor, reintenta.');
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
            .join('\n')}\nPrompt 3D: ${s.imagePrompt || 'Render 3D moderno'}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(fullScript);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      {/* Top Banner / Tool Header */}
      <div className="pb-4 border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-orange-400 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Estudio IA: Avatares Reales Hablando & Render 3D
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">PDF Completo a Video</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Creador de Videos con Avatar IA y Visuales 3D
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Convierte cualquier PDF en un video profesional con presentadores virtuales hablando sincronizados, recreación de guiones de alto impacto y fondos 3D hipermodernos.
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
                  <span>Crear & Descargar Video con Avatar</span>
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
        {/* Left Column: PDF Input, Avatar Selector & 3D Style (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Document Upload Card */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>1. Documento PDF Completo</span>
              </h3>
              {customFileName && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {customFileName}
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
              className="p-5 rounded-2xl border-2 border-dashed border-white/15 hover:border-orange-500/60 bg-white/[0.02] hover:bg-orange-500/[0.04] text-center cursor-pointer transition-all group"
            >
              <FileUp className="w-7 h-7 mx-auto mb-2 text-slate-400 group-hover:text-orange-400 transition-colors" />
              <p className="text-xs font-bold text-slate-200 group-hover:text-white">
                {customFileName ? customFileName : 'Haz clic para subir cualquier PDF'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                La IA procesa todas las páginas, crea el guion y asigna escenas 3D.
              </p>
            </div>

            {/* Preset Samples */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                O prueba con documentos de ejemplo:
              </p>
              <div className="space-y-1.5">
                {samplePdfOptions.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 cursor-pointer ${
                      selectedSample.id === sample.id && !customFileName
                        ? 'bg-orange-500/10 border-orange-500/40 text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white/5 text-orange-400 shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{sample.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{sample.summary}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Presenter / Avatar Selection Card */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-orange-400" />
                <span>2. Avatar Real Hablando (Presentador)</span>
              </h3>
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAvatarInVideo}
                  onChange={(e) => setIncludeAvatarInVideo(e.target.checked)}
                  className="rounded border-white/20 bg-black text-orange-500"
                />
                <span>Activo</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {AI_PRESENTERS.map((presenter) => {
                const isSelected = currentPresenter.id === presenter.id;
                return (
                  <button
                    key={presenter.id}
                    onClick={() => setCurrentPresenter(presenter)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20 shrink-0">
                      <img src={presenter.avatarUrl} alt={presenter.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-white">{presenter.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{presenter.tone.split(' ')[0]}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Presentador seleccionado: <strong>{currentPresenter.name}</strong> ({currentPresenter.specialty})</span>
            </div>
          </div>

          {/* 3D Visual Style Selector */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-orange-400" />
              <span>3. Estilo Visual 3D Moderno</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {MODERN_3D_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleChange3DStyle(style.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    visualStyle3D === style.id
                      ? 'bg-white/10 border-orange-500 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">{style.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{style.badge}</p>
                </button>
              ))}
            </div>

            {/* Aspect Ratio Buttons */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Orientación del Video
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    aspectRatio === '9:16'
                      ? 'bg-orange-500/10 border-orange-500 text-white font-medium'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  <div className="text-left">
                    <p className="text-xs font-bold">9:16 Vertical</p>
                    <p className="text-[10px] text-slate-400">TikTok, Reels</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    aspectRatio === '16:9'
                      ? 'bg-orange-500/10 border-orange-500 text-white font-medium'
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
          </div>
        </div>

        {/* Right Column: Live Video Canvas, Talking Avatar & Script Assistant (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Video Display Screen */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Vista Previa del Video con Avatar 3D
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  (Escena {currentSceneIdx + 1} de {scenes.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerate3DImage}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Cambiar imagen 3D de esta escena"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">Nueva Imagen 3D</span>
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
            <div className="relative flex items-center justify-center p-4 bg-black/85 rounded-2xl overflow-hidden min-h-[440px] border border-white/5">
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
                /* The Live Scene Screen with 3D Background & Talking Avatar Presenter */
                <div
                  className={`relative transition-all duration-300 rounded-2xl border border-white/15 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden ${
                    aspectRatio === '9:16'
                      ? 'w-[320px] h-[540px] max-w-full'
                      : 'w-full max-w-[650px] h-[370px]'
                  }`}
                  style={{
                    backgroundImage: currentScene.imageUrl ? `url(${currentScene.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Dark gradient overlay for 3D depth and readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50 z-0 pointer-events-none" />

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentScene.accentColor }} />
                      <span className="text-[11px] font-bold text-white tracking-wide uppercase drop-shadow">
                        3D Render Studio · Escena {currentSceneIdx + 1}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 border border-white/10 text-slate-200">
                      0{currentSceneIdx + 1} / 0{scenes.length}
                    </span>
                  </div>

                  {/* Center Content: Slide Title & 3D Cards */}
                  <div className="relative z-10 my-auto space-y-3 pt-2">
                    <h3 
                      className={`font-black text-white leading-tight tracking-tight drop-shadow-xl ${
                        aspectRatio === '9:16' ? 'text-lg' : 'text-xl'
                      }`}
                    >
                      {currentScene.title}
                    </h3>

                    {/* Bullet Points with 3D glass effect */}
                    <div className="space-y-1.5 pt-1">
                      {currentScene.bulletPoints.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2 text-xs text-slate-100 bg-black/60 p-2.5 rounded-xl border border-white/10 backdrop-blur-md shadow-lg"
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

                  {/* Talking Avatar Overlay in Corner */}
                  {includeAvatarInVideo && (
                    <div className="absolute right-4 bottom-24 z-20 pointer-events-none">
                      <TalkingAvatarPresenter
                        currentPresenter={currentPresenter}
                        isSpeaking={isPlaying}
                        onSelectPresenter={setCurrentPresenter}
                        size="sm"
                      />
                    </div>
                  )}

                  {/* Subtitles Overlay Bar (Karaoke style) */}
                  <div className="relative z-10 mt-auto pt-2">
                    <div className="bg-black/85 border border-white/20 px-3 py-2 rounded-xl backdrop-blur-md shadow-xl text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[9px] text-orange-400 font-bold uppercase mb-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Locución & Subtítulos en Vivo</span>
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
                      <span>Reproducir con Avatar Hablando</span>
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

          {/* AI Creative Assistant & Script Recreator Panel */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-orange-400" />
                <span>Asistente IA Profesional & Recreador de Script</span>
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Director IA Activo
              </span>
            </div>

            {/* Quick Framework Recreator Buttons */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Recrear Guion en 1-Clic:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleRecreateWithFramework('viral-reels')}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500/15 to-transparent border border-orange-500/30 hover:border-orange-500/60 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:text-orange-300">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Viral TikTok / Reels</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Ganchos de alta retención</p>
                </button>

                <button
                  onClick={() => handleRecreateWithFramework('pitch-deck')}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500/15 to-transparent border border-blue-500/30 hover:border-blue-500/60 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Pitch Deck B2B</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Problema, Solución y ROI</p>
                </button>

                <button
                  onClick={() => handleRecreateWithFramework('masterclass')}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-transparent border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Masterclass Cursos</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Didáctico paso a paso</p>
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-black/50 border border-white/5 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-orange-500/20 text-orange-100 ml-8 border border-orange-500/30'
                      : 'bg-white/5 text-slate-200 mr-8 border border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>{msg.sender === 'user' ? 'Tú' : 'Asistente Director IA'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
              {isAssistantThinking && (
                <div className="p-2.5 rounded-xl bg-white/5 text-slate-400 flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                  <span>El Asistente está reescribiendo el guion y ajustando las imágenes 3D...</span>
                </div>
              )}
            </div>

            {/* Instruction Form */}
            <form onSubmit={handleSendAssistantInstruction} className="flex gap-2">
              <input
                type="text"
                placeholder="Pide un cambio (ej: 'Hazlo más enérgico', 'Acorta el guion', 'Estilo 3D Cyber')..."
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isAssistantThinking || !assistantInput.trim()}
                className="px-4 py-2.5 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Pedir</span>
              </button>
            </form>
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
                Renderizando Video con Avatar Hablando y Fondos 3D...
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Generando fotogramas en alta resolución con el presentador {currentPresenter.name}, locución sincronizada y subtítulos dinámicos.
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
              El archivo de video final se descargará automáticamente a tu equipo al completar el 100%.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
