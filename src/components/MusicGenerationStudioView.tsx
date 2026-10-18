import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, Volume2, VolumeX, Play, Pause, Download, Sparkles, 
  Sliders, RefreshCw, Radio, Disc, Zap, Check, ArrowRight
} from 'lucide-react';

interface MusicGenerationStudioViewProps {
  onAttachMusicToVideo?: (trackName: string, trackUrl: string) => void;
}

export const MusicGenerationStudioView: React.FC<MusicGenerationStudioViewProps> = ({
  onAttachMusicToVideo
}) => {
  const [modelType, setModelType] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [durationSec, setDurationSec] = useState(30);
  const [prompt, setPrompt] = useState('Banda sonora lo-fi moderna con sintetizadores cálidos, piano eléctrico y beat de baja fidelidad ideal para tutoriales');
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [attached, setAttached] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const PRESET_TRACKS = [
    {
      title: 'Lo-Fi Chill & Focus',
      prompt: 'Banda sonora lo-fi moderna con sintetizadores cálidos, piano eléctrico y beat de baja fidelidad ideal para tutoriales',
      bpm: 85,
      model: 'lyria-3-clip-preview' as const,
      mood: 'Relajado & Educativo'
    },
    {
      title: 'Cyber Synthwave 80s',
      prompt: 'Synthwave futurista con arpegios analógicos vibrantes, bajo sintetizado potente y batería electrónica retro',
      bpm: 128,
      model: 'lyria-3-clip-preview' as const,
      mood: 'Energético & Tech'
    },
    {
      title: 'Cinematic Epic Orchestral',
      prompt: 'Banda sonora épica orquestal con cuerdas crescendos, metales heroicos y tambores taiko de gran impacto',
      bpm: 110,
      model: 'lyria-3-pro-preview' as const,
      mood: 'Inspirador & Heroico'
    },
    {
      title: 'Corporate Ambient Acoustic',
      prompt: 'Música corporativa acústica positiva con guitarras ligeras, glockenspiel sutil y ritmo optimista de negocios',
      bpm: 115,
      model: 'lyria-3-clip-preview' as const,
      mood: 'Negocios & SaaS'
    }
  ];

  // Synthesize interactive audio preview via Web Audio API
  const togglePlayAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioCtxRef.current?.suspend();
    } else {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        startSynthesizerTrack(audioCtxRef.current);
      } else {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
    }
  };

  const startSynthesizerTrack = (ctx: AudioContext) => {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);

    // Looping chord arpeggio
    const chord = [220, 261.63, 329.63, 392.0];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(filter);
      osc.start();
    });

    filter.connect(gain);
    gain.connect(ctx.destination);
  };

  // Waveform visualization animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      phase += isPlaying ? 0.08 : 0.01;

      ctx.fillStyle = '#0B0D14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bars = 48;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const heightFactor = isPlaying
          ? Math.abs(Math.sin(phase + i * 0.25)) * 0.7 + 0.3
          : Math.abs(Math.sin(phase + i * 0.1)) * 0.15 + 0.05;

        const h = heightFactor * (canvas.height - 20);
        const x = i * barWidth;
        const y = (canvas.height - h) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + h);
        gradient.addColorStop(0, '#A855F7');
        gradient.addColorStop(1, '#EC4899');
        ctx.fillStyle = gradient;

        ctx.fillRect(x + 2, y, barWidth - 4, h);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleGenerateMusic = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsPlaying(true);
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        startSynthesizerTrack(audioCtxRef.current);
      } else {
        audioCtxRef.current.resume();
      }
    }, 1800);
  };

  const handleAttach = () => {
    onAttachMusicToVideo?.('Lyria AI Soundtrack (30s)', 'ambient-lofi-lyria');
    setAttached(true);
    setTimeout(() => setAttached(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-fuchsia-950/40 via-[#121424] to-[#0E101A] border border-fuchsia-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/25">
            <Music className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                Motor Google Lyria Music
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Modelos: lyria-3-clip-preview & lyria-3-pro-preview</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">
              Generador de Música & Bandas Sonoras con Lyria 3
            </h1>
            <p className="text-xs text-slate-400 max-w-xl mt-0.5">
              Compón pistas musicales originales y clips sonoros de hasta 30s o temas completos para ambientar tus videos de PDF, TikToks y presentaciones.
            </p>
          </div>
        </div>

        <button
          onClick={handleAttach}
          className="py-3 px-5 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
        >
          {attached ? <Check className="w-4 h-4 text-emerald-300" /> : <Zap className="w-4 h-4" />}
          <span>{attached ? '¡Música Vinculada a tu Video!' : 'Vincular a Convertidor de Video'}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Controls & Prompts (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Model Selector */}
          <div className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-3 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Modelo Lyria Seleccionado:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setModelType('lyria-3-clip-preview');
                  setDurationSec(30);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  modelType === 'lyria-3-clip-preview'
                    ? 'bg-fuchsia-600/20 border-fuchsia-500 text-white font-bold'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <p className="text-xs font-bold">lyria-3-clip-preview</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Clips cortos de hasta 30s</p>
              </button>

              <button
                onClick={() => {
                  setModelType('lyria-3-pro-preview');
                  setDurationSec(90);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  modelType === 'lyria-3-pro-preview'
                    ? 'bg-fuchsia-600/20 border-fuchsia-500 text-white font-bold'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <p className="text-xs font-bold">lyria-3-pro-preview</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pistas completas Pro</p>
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-3 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Descripción Musical & Vibe:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Instrumentos, tempo, estado de ánimo, estilo musical..."
              className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors leading-relaxed"
            />

            {/* Presets */}
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Estilos Pre-diseñados:
              </span>
              <div className="space-y-1">
                {PRESET_TRACKS.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(t.prompt);
                      setBpm(t.bpm);
                      setModelType(t.model);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 text-left text-xs transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">{t.title}</span>
                      <span className="text-[10px] text-slate-400">{t.mood} · {t.bpm} BPM</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateMusic}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 hover:from-fuchsia-500 hover:to-pink-400 text-white text-xs font-bold rounded-2xl transition-all shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Componiendo con Lyria 3...</span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4" />
                <span>Generar Música con {modelType}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Waveform Canvas Player & Output (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#131622] border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider block">
                  Reproductor de Audio & Espectrograma
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Pista Sintetizada: {durationSec} Segundos
                </h3>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                {bpm} BPM
              </span>
            </div>

            {/* Audio Waveform Canvas */}
            <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-white/10 p-4 shadow-inner">
              <canvas
                ref={canvasRef}
                width={560}
                height={160}
                className="w-full h-36 rounded-xl block"
              />
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={togglePlayAudio}
                className="py-2.5 px-5 bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pausar Reproducción' : 'Escuchar Pista'}</span>
              </button>

              <button
                onClick={handleAttach}
                className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                <span>Usar en Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
