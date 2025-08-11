import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { MemoPageMode } from '@/constants.ts'
import { countMemos, createMemo, updateMemoById } from '@/db/dbApi.ts'

interface PageFlowOptions {
  text: string
  title: string
  hasChanges: boolean
  draftKey: string
  onSave?: () => void
  onDiscard?: () => void
  onValidationError?: () => void
  mode?: MemoPageMode
}

interface PageFlow {
  saving: boolean
  showConfirm: boolean
  setShowConfirm: (value: boolean) => void
  handleBack: () => Promise<void> | void
  saveNote: () => Promise<void> | void
  discardAndLeave: () => Promise<void> | void
}

export function usePageFlow(options: PageFlowOptions): PageFlow {
  const { text, title, hasChanges, draftKey, onSave, onDiscard, onValidationError, mode } = options
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { id } = useParams<{ id: string }>()

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
    const trimmedTitle = title.trim()
    if ((trimmedText || trimmedTitle) && hasChanges) {
      setShowConfirm(true)
      return
    }
    navigateToMemos()
  }, [text, title, hasChanges, navigateToMemos])

  const saveNote = useCallback(async () => {
    const trimmedText = text.trim()
    const trimmedTitle = title.trim()

    if (!trimmedText && !trimmedTitle) {
      onValidationError?.()
      return
    }

    setSaving(true)
    try {
      if (mode === MemoPageMode.Edit) {
        await updateMemoById(Number(id), {
          text: trimmedText,
          title: trimmedTitle,
        })
      } else {
        await createMemo(trimmedText, trimmedTitle)
      }
      onSave?.()
    } finally {
      setSaving(false)
      setShowConfirm(false)
      clearDraft()
    }
  }, [text, title, onValidationError, mode, onSave, id, clearDraft])

  const discardAndLeave = useCallback(async () => {
    clearDraft()
    onDiscard?.()
    navigateToMemos()
  }, [clearDraft, onDiscard, navigateToMemos])

  return { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave }
}
