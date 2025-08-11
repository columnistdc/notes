interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const textClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-orange-200 border-t-orange-500`}></div>
      {text && <p className={`text-slate-600 ${textClasses[size]}`}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBEA]">
        {spinner}
      </div>
    )
  }

  return spinner
}
