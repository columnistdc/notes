import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { countMemos, createMemo } from '@/db/dbApi.ts'

export interface PageFlowOptions {
  text: string
  title: string
  hasChanges: boolean
  draftKey: string
  onSave?: () => void
  onValidationError?: () => void
}

export interface PageFlow {
  saving: boolean
  showConfirm: boolean
  setShowConfirm: (value: boolean) => void
  handleBack: () => Promise<void> | void
  saveNote: () => Promise<void> | void
  discardAndLeave: () => Promise<void> | void
}

export function usePageFlow(options: PageFlowOptions): PageFlow {
  const { text, title, hasChanges, draftKey, onSave, onValidationError } = options
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey)
    localStorage.removeItem(`${draftKey}-title`)
  }, [draftKey])

  const navigateToMemos = useCallback(async () => {
    const total = await countMemos()
    navigate(total === 0 ? '/' : '/memos', { replace: true })
  }, [navigate])

  const handleBack = useCallback(async () => {
    const trimmedText = text.trim()
    if (trimmedText && hasChanges) {
      setShowConfirm(true)
      return
    }
    navigateToMemos()
  }, [text, hasChanges, navigateToMemos])

  const saveNote = useCallback(async () => {
    const trimmedText = text.trim()
    const trimmedTitle = title.trim()

    if (!trimmedText && !trimmedTitle) {
      onValidationError?.()
      return
    }

    setSaving(true)
    try {
      await createMemo(trimmedText, trimmedTitle)
      onSave?.()
    } finally {
      setSaving(false)
      setShowConfirm(false)
      clearDraft()
    }
  }, [clearDraft, text, title, onSave, onValidationError])

  const discardAndLeave = useCallback(async () => {
    clearDraft()
    onSave?.()
    navigateToMemos()
  }, [clearDraft, onSave, navigateToMemos])

  return { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave }
}
