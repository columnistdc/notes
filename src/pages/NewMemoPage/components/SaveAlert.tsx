type SaveAlertProps = {
  show: boolean
}

export const SaveAlert = ({ show }: SaveAlertProps) => {
  if (!show) return null

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600" fill="currentColor" aria-hidden="true">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          <span className="text-sm font-medium">Fill in the title or text of the note to save</span>
        </div>
      </div>
    </div>
  )
}
