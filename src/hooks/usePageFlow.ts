import { type RefObject, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MemoPageMode } from '@/constants.ts'
import { countMemos, createMemo, MemoConflictError, updateMemoById } from '@/db/dbApi.ts'

interface PageFlowOptions {
  text: string
  title: string
  hasChanges: boolean
  draftKey: string
  memoId?: string
  expectedUpdatedAt?: RefObject<number | undefined>
  onSave?: () => void
  onDiscard?: () => void
  onValidationError?: () => void
  onSaveError?: () => void
  onConflict?: () => void
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
  const { text, title, hasChanges, draftKey, memoId: id, expectedUpdatedAt, onSave, onDiscard, onValidationError, onSaveError, onConflict, mode } = options
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey)
    localStorage.removeItem(`${draftKey}-title`)
  }, [draftKey])

  const navigateToMemos = useCallback(async () => {
    try {
      const total = await countMemos()
      void navigate(total === 0 ? '/' : '/memos', { replace: true })
    } catch {
      void navigate('/memos', { replace: true })
    }
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
        await updateMemoById(
          memoId,
          { text: trimmedText, title: trimmedTitle },
          expectedUpdatedAt?.current,
        )
      } else {
        await createMemo(trimmedText, trimmedTitle)
      }
      clearDraft()
      setShowConfirm(false)
      onSave?.()
    } catch (err) {
      if (err instanceof MemoConflictError) {
        onConflict?.()
      } else {
        onSaveError?.()
      }
    } finally {
      setSaving(false)
    }
  }, [text, title, onValidationError, onSaveError, onConflict, expectedUpdatedAt, mode, onSave, id, clearDraft])

  const discardAndLeave = useCallback(async () => {
    clearDraft()
    onDiscard?.()
    await navigateToMemos()
  }, [clearDraft, onDiscard, navigateToMemos])

  return { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave }
}
