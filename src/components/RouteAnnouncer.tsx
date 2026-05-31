import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/memos': 'All Memos',
  '/new': 'New Memo',
}

export const RouteAnnouncer = () => {
  const { pathname } = useLocation()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const label =
      PAGE_LABELS[pathname] ?? (pathname.startsWith('/edit/') ? 'Edit Memo' : 'Page changed')
    // Direct DOM mutation keeps announcement out of React render cycle
    // while still triggering the aria-live region for screen readers.
    ref.current.textContent = label
  }, [pathname])

  return <span ref={ref} aria-live="polite" aria-atomic="true" className="sr-only" />
}
