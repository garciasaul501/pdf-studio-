import { useCallback, useRef, useState } from 'react'

interface DropzoneProps {
  onFile: (file: File) => void
}

export function Dropzone({ onFile }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (file) onFile(file)
    },
    [onFile],
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 sm:p-20 ${
        isDragging
          ? 'scale-[1.01] border-violet-400/70 bg-violet-500/10'
          : 'border-white/15 bg-white/[0.03] hover:border-violet-400/40 hover:bg-white/[0.05]'
      }`}
    >
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 via-fuchsia-500/20 to-cyan-400/25 text-violet-300 shadow-inner transition-transform duration-300 ${
          isDragging ? 'scale-110' : 'group-hover:scale-105'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-9 w-9"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3.75 3.75 0 0 1 4.03 6.83A4.5 4.5 0 0 1 17.25 19.5H6.75Z"
          />
        </svg>
      </div>
      <div className="space-y-1.5">
        <p className="text-lg font-semibold text-white sm:text-xl">
          Arrastra tu libro PDF aquí
        </p>
        <p className="text-sm text-slate-400">
          o haz clic para seleccionar un archivo
        </p>
      </div>
      <p className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-400">
        Hasta 50 MB · máximo 300 páginas
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          inputRef.current?.click()
        }}
        className="mt-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-violet-400/40 hover:bg-white/10"
      >
        Seleccionar archivo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
