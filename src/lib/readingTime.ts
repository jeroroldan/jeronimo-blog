/** Calcula minutos de lectura (~200 palabras/min, mínimo 1). */
export function getReadingTime(text: string | undefined, wpm = 200): number {
  if (!text) return 1;
  const words = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_\-[\]()!|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wpm));
}
