import { type ReactNode, useEffect, useRef } from 'react'

interface DialogShellProps {
  labelId: string
  onClose: () => void
  children: ReactNode
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export const DialogShell = ({ labelId, onClose, children }: DialogShellProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()
    return () => {
      previouslyFocused?.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (e.key !== 'Tab') return

      const elements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      )
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (!first || !last) return

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby={labelId}
    >
      <div ref={dialogRef} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        {children}
      </div>
    </div>
  )
}
