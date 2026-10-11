import type { GenerationProgress } from '#/lib/types'

const STEPS: { key: GenerationProgress['step']; label: string; at: number }[] = [
  { key: 'images', label: 'Extrayendo imágenes', at: 20 },
  { key: 'audio', label: 'Creando voz', at: 40 },
  { key: 'composing', label: 'Componiendo video', at: 90 },
  { key: 'done', label: 'Finalizando', at: 100 },
]

export function GeneratingSteps({ progress }: { progress: GenerationProgress }) {
  return (
    <div className="w-full space-y-4">
      {STEPS.map((step, i) => {
        const done = progress.percent >= step.at
        const active = !done && progress.step === step.key
        return (
          <div key={step.key} className="relative flex items-center gap-4">
            {i < STEPS.length - 1 && (
              <div
                className={`absolute left-3.5 top-7 h-6 w-px ${
                  done ? 'bg-violet-400/50' : 'bg-white/10'
                }`}
              />
            )}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                done
                  ? 'bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                  : active
                    ? 'animate-pulse bg-violet-500/80 text-white'
                    : 'bg-white/10 text-slate-500'
              }`}
            >
              {done ? '✓' : ''}
            </div>
            <span
              className={
                done
                  ? 'text-slate-200'
                  : active
                    ? 'font-semibold text-white'
                    : 'text-slate-500'
              }
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
