import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MemoPageMode } from '@/constants.ts'
import { getMemoById } from '@/db/dbApi.ts'

interface TextControllerOptions {
  draftKey: string
  mode: MemoPageMode
}

interface TextController {
  title: string
  setTitle: (value: string) => void
  text: string
  setText: (value: string) => void
  insertAtCursor: (snippet: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

export function useTextController(options: TextControllerOptions): TextController {
  const { draftKey, mode } = options
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const initialText = useRef('')
  const initialTitle = useRef('')
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (mode === MemoPageMode.Edit) {
      const memoId = Number(id)
      if (!id || isNaN(memoId)) {
        console.error('Invalid memo ID:', id)
        return
      }
      getMemoById(Number(memoId)).then((memo) => {
        if (memo) {
          const memoText = memo.text || ''
          const memoTitle = memo.title || ''
          setText(memoText)
          setTitle(memoTitle)
          initialText.current = memoText
          initialTitle.current = memoTitle
        }
      })
    } else {
      const draft = localStorage.getItem(draftKey) || ''
      const titleDraft = localStorage.getItem(`${draftKey}-title`) || ''

      setText(draft)
      setTitle(titleDraft)
      initialText.current = draft
      initialTitle.current = titleDraft
    }
  }, [draftKey, id, mode])

  useEffect(() => {
    if (mode === MemoPageMode.Edit) {
      return
    }
    const hasChanged = text !== initialText.current || title !== initialTitle.current

    const timeoutId = setTimeout(() => {
      if (hasChanged) {
        localStorage.setItem(draftKey, text)
        localStorage.setItem(`${draftKey}-title`, title)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [text, title, draftKey, mode])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const hasChanged = text !== initialText.current || title !== initialTitle.current
      if (hasChanged && mode !== MemoPageMode.Edit) {
        localStorage.setItem(draftKey, text)
        localStorage.setItem(`${draftKey}-title`, title)
      }
      if (hasChanged) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [text, title, draftKey, mode])

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
