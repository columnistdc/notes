import { type FC, useCallback, useState } from 'react'

import type { MemoPageMode } from '@/constants.ts'
import { TAB_DRAFT_KEY } from '@/constants.ts'
import { usePageFlow } from '@/hooks/usePageFlow.ts'
import { useSaveAlert } from '@/hooks/useSaveAlert.ts'
import { useTextController } from '@/hooks/useTextController.ts'

import { ConfirmDialog } from '../../components/ConfirmDialog.tsx'
import { MemoHeader } from '../../components/MemoHeader.tsx'
import { SaveAlert } from '../../components/SaveAlert.tsx'
import { TextEditor } from '../../components/TextEditor.tsx'
import { TitleInput } from '../../components/TitleInput.tsx'

interface Props {
  mode: MemoPageMode
}

export const MemoPage: FC<Props> = ({ mode }) => {
  const [hasChanges, setHasChanges] = useState(false)
  const { showAlert, show: showSaveAlert, hide: hideSaveAlert } = useSaveAlert()
  const [saveError, setSaveError] = useState(false)
  const [conflictError, setConflictError] = useState(false)

  const { title, setTitle, text, setText, insertAtCursor, textareaRef, loadedUpdatedAt } =
    useTextController({ mode, draftKey: TAB_DRAFT_KEY })

  const { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave } =
    usePageFlow({
      text,
      title,
      mode,
      hasChanges,
      draftKey: TAB_DRAFT_KEY,
      expectedUpdatedAt: loadedUpdatedAt,
      onSave: () => setHasChanges(false),
      onDiscard: () => setHasChanges(false),
      onValidationError: showSaveAlert,
      onSaveError: () => setSaveError(true),
      onConflict: () => setConflictError(true),
    })

  const onDictation = useCallback(
    (result: string) => {
      if (!result) return
      insertAtCursor(result + ' ')
    },
    [insertAtCursor],
  )

  const clearAlerts = useCallback(() => {
    hideSaveAlert()
    setSaveError(false)
    setConflictError(false)
  }, [hideSaveAlert])

  const handleSave = useCallback(() => {
    clearAlerts()
    void saveNote()
  }, [saveNote, clearAlerts])

  const handleChangeText = useCallback(
    (value: string) => {
      setText(value)
      setHasChanges(true)
      clearAlerts()
    },
    [setText, clearAlerts],
  )

  const handleSetTitle = useCallback(
    (value: string) => {
      setTitle(value)
      setHasChanges(true)
      clearAlerts()
    },
    [setTitle, clearAlerts],
  )

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBEA] text-slate-900" id="main-content">
      <MemoHeader
        onBack={() => {
          void handleBack()
        }}
        onSave={handleSave}
        saving={saving}
        canSave={text.trim().length > 0 || title.trim().length > 0}
        mode={mode}
        title={title}
      />

      <div className="mx-auto w-full max-w-3xl px-4 pt-4">
        <TitleInput title={title} onChange={handleSetTitle} />
      </div>

      <SaveAlert show={showAlert} />
      <SaveAlert show={saveError} message="Failed to save memo. Please try again." variant="error" />
      <SaveAlert
        show={conflictError}
        message="This memo was modified in another tab. Reload the page to get the latest version before saving."
        variant="error"
      />

      <TextEditor
        text={text}
        onChange={handleChangeText}
        onDictation={onDictation}
        textareaRef={textareaRef}
      />

      <ConfirmDialog
        show={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onDiscard={() => {
          void discardAndLeave()
        }}
        onSave={handleSave}
      />
    </div>
  )
}
