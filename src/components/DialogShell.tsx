import { type KeyboardEvent, type ReactNode, useEffect, useRef } from 'react'

interface DialogShellProps {
  labelId: string
  onClose: () => void
  children: ReactNode
}

export const DialogShell = ({ labelId, onClose, children }: DialogShellProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null

    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()

    return () => {
      prev?.focus()
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }

    if (e.key !== 'Tab') return

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first || !last) return

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby={labelId}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </div>
  )
}
