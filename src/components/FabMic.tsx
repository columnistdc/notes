import { useCallback } from 'react'

import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

type Props = {
  onResult: (text: string) => void
  disabled?: boolean
  className?: string
  label?: string
}

export default function FabMic({
  onResult,
  disabled = false,
  className,
  label = 'Dictate',
}: Props) {
  const { isSupported, listening, error, transcript, start, stop, resetTranscript } =
    useSpeechRecognition({ onResult })

  const handleClick = useCallback(() => {
    if (!isSupported || disabled) return
    if (listening) {
      onResult(transcript)
      stop()
    } else {
      resetTranscript()
      start()
    }
  }, [isSupported, disabled, listening, stop, onResult, transcript, resetTranscript, start])

  const btnBase =
    'fixed right-6 bottom-6 z-50 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition shadow-xl'
  const orangeBorder = 'border-2 border-[rgba(255,165,0,0.5)]'
  const normalBg = 'bg-[rgba(255,165,0,0.15)]'
  const disabledCls =
    'opacity-60 grayscale cursor-not-allowed pointer-events-none border-slate-300 bg-slate-200'
  const activeHover = 'hover:shadow-2xl hover:-translate-y-[1px]'
  const iconCls = listening ? 'text-orange-600' : 'text-slate-900'

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={listening}
        aria-disabled={disabled || !isSupported}
        aria-busy={listening}
        title={label}
        className={[
          btnBase,
          orangeBorder,
          disabled || !isSupported ? disabledCls : `${normalBg} ${activeHover}`,
          'relative',
          className || '',
        ].join(' ')}
        disabled={disabled || !isSupported}
      >
        {listening && (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-orange-400/30"
          />
        )}

        <svg viewBox="0 0 24 24" className={`h-6 w-6 md:h-7 md:w-7 ${iconCls}`} fill="currentColor">
          <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V20H8v2h8v-2h-3v-2.08A7 7 0 0 0 19 11h-2Z" />
        </svg>
      </button>

      {!isSupported && (
        <div className="rounded-lg border border-amber-200 bg-white/90 px-3 py-2 text-sm text-amber-700 shadow">
          SpeechRecognition not supported
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-white/90 px-3 py-2 text-sm text-red-700 shadow">
          Speech: {error}
        </div>
      )}
    </>
  )
}
