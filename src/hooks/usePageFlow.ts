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
  onSaveError?: () => void
  mode: MemoPageMode
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
  const { text, title, hasChanges, draftKey, onSave, onDiscard, onValidationError, onSaveError, mode } = options
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
    void navigate(total === 0 ? '/' : '/memos', { replace: true })
  }, [navigate])

  const handleBack = useCallback(async () => {
    const trimmedText = text.trim()
    const trimmedTitle = title.trim()
    if ((trimmedText || trimmedTitle) && hasChanges) {
      setShowConfirm(true)
      return
    }
    await navigateToMemos()
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
        const memoId = Number(id)
        if (!id || isNaN(memoId)) {
          console.error('Invalid memo ID:', id)
          return
        }
        await updateMemoById(memoId, {
          text: trimmedText,
          title: trimmedTitle,
        })
      } else {
        await createMemo(trimmedText, trimmedTitle)
      }
      clearDraft()
      setShowConfirm(false)
      onSave?.()
    } catch {
      onSaveError?.()
    } finally {
      setSaving(false)
    }
  }, [text, title, onValidationError, onSaveError, mode, onSave, id, clearDraft])

  const discardAndLeave = useCallback(async () => {
    clearDraft()
    onDiscard?.()
    await navigateToMemos()
  }, [clearDraft, onDiscard, navigateToMemos])

  return { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave }
}
