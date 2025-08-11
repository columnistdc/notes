export function createTextPreview(text: string): string {
  const s = text.replace(/\s+/g, ' ').trim()
  return s.length > 140 ? s.slice(0, 140).trimEnd() + '…' : s
}
