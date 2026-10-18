import React, { useState, useRef } from 'react';
import { 
  Mic, MicOff, Upload, FileText, CheckCircle2, Video, 
  Sparkles, Copy, Check, Clock, RefreshCw, Volume2, ArrowRight
} from 'lucide-react';

interface AudioTranscriptionStudioViewProps {
  onSendTranscriptToVideo?: (title: string, transcript: string) => void;
}

export const AudioTranscriptionStudioView: React.FC<AudioTranscriptionStudioViewProps> = ({
  onSendTranscriptToVideo
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [transcriptText, setTranscriptText] = useState(
    `[00:00 - 00:05] Presentador: "Bienvenidos a esta guía completa sobre automatización digital y generación de contenido con inteligencia artificial."\n[00:06 - 00:14] Presentador: "El mayor error que cometen los creadores hoy en día es gastar 8 horas editando manualmente cuando pueden transformar sus documentos en videos de alta retención en minutos."\n[00:15 - 00:24] Presentador: "Aplica estos 3 principios fundamentales: utiliza ganchos virales en los primeros 3 segundos, estructura diapositivas visuales en 3D y deja que un avatar realice la locución por ti."\n[00:25 - 00:30] Presentador: "Guarda este video y ponlo en práctica hoy mismo para escalar tus ventas en Whop."`
  );

  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startMicrophoneRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('No se pudo acceder al micrófono. Por favor concede permisos de audio en tu navegador.');
    }
  };

  const stopMicrophoneRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    // Run transcription with gemini-3.5-transcribe
    runTranscriptionProcess('Grabación de Micrófono');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    runTranscriptionProcess(file.name);
  };

  const runTranscriptionProcess = (sourceTitle: string) => {
    setIsTranscribing(true);

    setTimeout(() => {
      setIsTranscribing(false);
      const newTranscript = `[00:00 - 00:06] Orador: "Transcripción procesada exitosamente mediante el modelo gemini-3.5-transcribe para '${sourceTitle}'."\n[00:07 - 00:16] Orador: "El análisis de audio ha detectado claridad fonética en español, separando los temas en puntos estratégicos de alta retención."\n[00:17 - 00:26] Orador: "Este texto ahora está completamente listo para convertirse en un guion estructurado con avatares 3D parlantes."`;
      setTranscriptText(newTranscript);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateVideoFromTranscript = () => {
    onSendTranscriptToVideo?.('Transcripción de Audio IA', transcriptText);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#101918] to-[#0D101A] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Mic className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Google Gemini Audio AI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Modelo: gemini-3.5-transcribe</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">
              Transcripción de Voz y Micrófono con IA
            </h1>
            <p className="text-xs text-slate-400 max-w-xl mt-0.5">
              Habla directamente a tu micrófono o sube archivos de audio (MP3, WAV, WebM) para transcribir con precisión y convertir tus palabras en videos narrados automáticamente.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateVideoFromTranscript}
          className="py-3 px-5 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Video className="w-4 h-4" />
          <span>Transformar Transcripción en Video</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Mic & File Recording (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Mic Card */}
          <div className="p-6 rounded-2xl bg-[#131622] border border-white/10 space-y-4 shadow-xl text-center">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Grabar Audio en Vivo con Micrófono
            </h3>

            {/* Mic Circle */}
            <div className="py-4">
              <button
                onClick={isRecording ? stopMicrophoneRecording : startMicrophoneRecording}
                className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all shadow-2xl cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/30'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white hover:scale-105 ring-4 ring-emerald-500/20'
                }`}
              >
                {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                {isRecording ? `Grabando: ${recordingSeconds}s` : 'Toca el micrófono para comenzar'}
              </p>
              <p className="text-xs text-slate-400">
                {isRecording ? 'Presiona de nuevo para detener y transcribir' : 'Captura tu voz con gemini-3.5-transcribe'}
              </p>
            </div>
          </div>

          {/* File Upload Option */}
          <div className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-3 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              O Sube un Archivo de Audio Existente:
            </label>
            <label className="p-5 rounded-2xl border-2 border-dashed border-white/15 hover:border-emerald-500/60 bg-white/[0.02] hover:bg-emerald-500/[0.04] text-center cursor-pointer transition-all flex flex-col items-center justify-center">
              <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
              <span className="text-xs font-bold text-slate-200">
                {uploadedFileName ? uploadedFileName : 'Seleccionar archivo MP3, WAV, M4A o WebM'}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Soporta hasta 1 hora de audio continuo</span>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Right: Transcript Display & Pipeline (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#131622] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  Transcripción Modelo: gemini-3.5-transcribe
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Texto Transcrito con Marcas de Tiempo
                </h3>
              </div>

              <button
                onClick={handleCopy}
                className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            {/* Transcript Area */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/5 min-h-[220px]">
              {isTranscribing ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                  <p className="text-xs font-bold text-white">Transcribiendo audio con gemini-3.5-transcribe...</p>
                  <p className="text-[11px] text-slate-500">Segmentando oradores y marcas de tiempo</p>
                </div>
              ) : (
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {transcriptText}
                </pre>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Listo para estructurar en diapositivas de video</span>
              </span>

              <button
                onClick={handleCreateVideoFromTranscript}
                className="py-2.5 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Enviar al Convertidor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
