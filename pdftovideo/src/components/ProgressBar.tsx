interface ProgressBarProps {
  percent: number
  label?: string
  color?: 'blue' | 'green'
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex justify-between text-sm text-slate-300">
          <span>{label}</span>
          <span className="font-semibold text-slate-100">
            {Math.round(percent)}%
          </span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
