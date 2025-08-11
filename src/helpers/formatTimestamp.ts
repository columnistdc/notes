export function formatTimestamp(ts: number): string {
  const d = new Date(ts)

  if (isNaN(d.getTime())) {
    console.error('Invalid timestamp passed to formatTimestamp:', ts)
    return ''
  }

  const now = new Date()
  const isSameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()

  if (isSameDay) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
