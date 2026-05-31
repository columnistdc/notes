import { useCallback, useEffect, useRef, useState } from 'react'

interface Grammar {
  src: string
  weight?: number
}

interface SpeechRecognitionHookOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
  grammars?: Grammar[]
  onResult: (result: string) => void
}

interface SpeechRecognitionHook {
  isSupported: boolean
  listening: boolean
  error: string | null
  transcript: string
  start: () => void
  stop: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(options: SpeechRecognitionHookOptions): SpeechRecognitionHook {
  const {
    lang = typeof navigator !== 'undefined' ? navigator.language : 'en-US',
    continuous = false,
    interimResults = false,
    maxAlternatives = 1,
    grammars,
  } = options

  // Keep onResult in a ref so the effect doesn't re-run (and tear down the
  // recognition instance) every time the parent re-renders with a new callback.
  const onResultRef = useRef(options.onResult)
  useEffect(() => {
    onResultRef.current = options.onResult
  })

  const [isSupported] = useState(
    () =>
      typeof SpeechRecognition !== 'undefined' || typeof webkitSpeechRecognition !== 'undefined',
  )
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    let recognition: SpeechRecognition | null = null

    try {
      if (typeof SpeechRecognition !== 'undefined') {
        recognition = new SpeechRecognition()
      } else if (typeof webkitSpeechRecognition !== 'undefined') {
        recognition = new webkitSpeechRecognition()
      } else {
        return
      }
    } catch (e) {
      console.error('SpeechRecognition initialization failed:', e)
    }

    if (recognition) {
      recognition.lang = lang
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.maxAlternatives = maxAlternatives

      if (grammars?.length) {
        // Runtime feature detection via globalThis: the SpeechGrammarList
        // globals are typed as always-present but are absent in browsers
        // without grammar support, so we look them up as optional.
        const globals = globalThis as {
          SpeechGrammarList?: new () => SpeechGrammarList
          webkitSpeechGrammarList?: new () => SpeechGrammarList
        }
        const SGLConstructor = globals.SpeechGrammarList ?? globals.webkitSpeechGrammarList

        if (SGLConstructor) {
          const list = new SGLConstructor()
          for (const g of grammars) {
            try {
              list.addFromString(g.src, g.weight ?? 1.0)
            } catch (e) {
              console.error('Error adding grammar:', e)
            }
          }
          recognition.grammars = list
        }
      }

      recognition.onstart = () => {
        setListening(true)
        setError(null)
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error)
        setListening(false)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i]
          const alternative = res?.[0]
          if (res?.isFinal && alternative) {
            finalTranscript += alternative.transcript
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => `${prev} ${finalTranscript}`.trim())
          onResultRef.current(finalTranscript)
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      recognitionRef.current?.stop()
      recognitionRef.current = null
    }
  }, [lang, continuous, interimResults, maxAlternatives, grammars])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
    } catch (e) {
      console.error('SpeechRecognition start failed:', e)
      setError('Failed to start speech recognition')
    }
  }, [])

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch (e) {
      console.error('SpeechRecognition stop failed:', e)
      setError('Failed to stop speech recognition')
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isSupported,
    listening,
    error,
    transcript,
    start,
    stop,
    resetTranscript,
  }
}
