import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { countMemos, createMemo } from '../../../db/dbApi.ts'

export type PageFlowOptions = {
  text: string
  title: string
  dirty: boolean
  draftKey: string
  onSave?: () => void
  onDiscard?: () => void
}

export type PageFlow = {
  saving: boolean
  showConfirm: null | 'back' | 'leave'
  setShowConfirm: (value: null | 'back' | 'leave') => void
  handleBack: () => Promise<void> | void
  saveNote: () => Promise<void> | void
  discardAndLeave: () => Promise<void> | void
}

export default function usePageFlow(options: PageFlowOptions): PageFlow {
  const { text, title, dirty, draftKey, onSave, onDiscard } = options
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState<null | 'back' | 'leave'>(null)

  const handleBack = useCallback(async () => {
    if (dirty && text.trim()) {
      setShowConfirm('back')
      return
    }
    const total = await countMemos()
    navigate(total === 0 ? '/' : '/memos', { replace: true })
  }, [dirty, text, navigate])

  const saveNote = useCallback(async () => {
    if (!text.trim()) return
    setSaving(true)
    try {
      await createMemo(text.trim(), title)
      localStorage.removeItem(draftKey)
      localStorage.removeItem(`${draftKey}-title`)
      onSave?.()
    } finally {
      setSaving(false)
    }
  }, [text, title, draftKey, onSave])

  const discardAndLeave = useCallback(async () => {
    localStorage.removeItem(draftKey)
    localStorage.removeItem(`${draftKey}-title`)
    onDiscard?.()
    const total = await countMemos()
    navigate(total === 0 ? '/' : '/memos', { replace: true })
  }, [draftKey, onDiscard, navigate])

  return { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave }
}
