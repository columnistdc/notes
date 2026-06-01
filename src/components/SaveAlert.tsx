type SaveAlertProps = {
  show: boolean
  message?: string
  variant?: 'warning' | 'error'
}

export const SaveAlert = ({
  show,
  message = 'Fill in the title or text of the note to save',
  variant = 'warning',
}: SaveAlertProps) => {
  if (!show) return null

  const isError = variant === 'error'

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div
        role="alert"
        className={
          isError
            ? 'rounded-lg border border-red-200 bg-red-50 p-3 text-red-800'
            : 'rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800'
        }
      >
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${isError ? 'text-red-600' : 'text-amber-600'}`}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  )
}
