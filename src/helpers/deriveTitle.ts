export function deriveTitle(text: string, max = 80): string {
  const firstLine =
    (text || '')
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find(Boolean) || ''
  return firstLine.length > max ? firstLine.slice(0, max - 1) + '…' : firstLine
}
