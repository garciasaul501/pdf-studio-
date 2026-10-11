let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null

/** Resolves once the browser has loaded its voice list (it loads async). */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voicesPromise) return voicesPromise
  voicesPromise = new Promise((resolve) => {
    const existing = speechSynthesis.getVoices()
    if (existing.length > 0) {
      resolve(existing)
      return
    }
    const handle = () => {
      const voices = speechSynthesis.getVoices()
      if (voices.length > 0) {
        speechSynthesis.removeEventListener('voiceschanged', handle)
        resolve(voices)
      }
    }
    speechSynthesis.addEventListener('voiceschanged', handle)
    // Some browsers never fire voiceschanged; give up after a beat.
    setTimeout(() => resolve(speechSynthesis.getVoices()), 1500)
  })
  return voicesPromise
}

/** Picks the best available neutral Spanish (Latin American) voice. */
export function pickSpanishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  const priority = ['es-419', 'es-mx', 'es-us', 'es-ar', 'es-co', 'es']
  for (const lang of priority) {
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(lang))
    if (match) return match
  }
  return voices[0] ?? null
}

/** Speaks one utterance and resolves when it finishes (or errors). */
export function speak(
  text: string,
  voice: SpeechSynthesisVoice | null,
): Promise<void> {
  return new Promise((resolve) => {
    if (!text.trim()) {
      resolve()
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang ?? 'es-419'
    utterance.rate = 1
    utterance.pitch = 1
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    speechSynthesis.speak(utterance)
  })
}
