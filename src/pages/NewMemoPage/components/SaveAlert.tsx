type SaveAlertProps = {
  show: boolean
}

export const SaveAlert = ({ show }: SaveAlertProps) => {
  if (!show) return null

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="text-sm font-medium">Fill in the title or text of the note to save</span>
        </div>
      </div>
    </div>
  )
}
