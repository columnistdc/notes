import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

export type TextControllerOptions = {
  draftKey: string
}

export type TextController = {
  title: string
  setTitle: (value: string) => void
  text: string
  setText: (value: string) => void
  insertAtCursor: (snippet: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

export function useTextController(options: TextControllerOptions): TextController {
  const { draftKey } = options
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const initialText = useRef('')
  const initialTitle = useRef('')

  useEffect(() => {
    const draft = localStorage.getItem(draftKey) || ''
    const titleDraft = localStorage.getItem(`${draftKey}-title`) || ''

    setText(draft)
    setTitle(titleDraft)
    initialText.current = draft
    initialTitle.current = titleDraft
  }, [draftKey])

  useEffect(() => {
    const hasChanged = text !== initialText.current || title !== initialTitle.current

    const timeoutId = setTimeout(() => {
      if (hasChanged) {
        localStorage.setItem(draftKey, text)
        localStorage.setItem(`${draftKey}-title`, title)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [text, title, draftKey])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const hasChanged = text !== initialText.current || title !== initialTitle.current
      if (hasChanged) {
        localStorage.setItem(draftKey, text)
        localStorage.setItem(`${draftKey}-title`, title)
      }
      if (!text.trim() && !title.trim()) return
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [text, title, draftKey])

  const insertAtCursor = useCallback((snippet: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const newValue = el.value.slice(0, start) + snippet + el.value.slice(end)
    setText(newValue)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + snippet.length
      el.setSelectionRange(pos, pos)
    })
  }, [])

  return {
    title,
    setTitle,
    text,
    setText,
    insertAtCursor,
    textareaRef,
  }
}
