import { useCallback, useState } from 'react'

import { ConfirmDialog } from './components/ConfirmDialog.tsx'
import { NewMemoHeader } from './components/NewMemoHeader.tsx'
import { SaveAlert } from './components/SaveAlert.tsx'
import { TextEditor } from './components/TextEditor.tsx'
import { TitleInput } from './components/TitleInput.tsx'
import { usePageFlow } from './hooks/usePageFlow.ts'
import { useSaveAlert } from './hooks/useSaveAlert.ts'
import { useTextController } from './hooks/useTextController.ts'

const NEW_MEMO_DRAFT_KEY = 'new-memo-draft-v1'

export const NewMemoPage = () => {
  const [hasChanges, setHasChanges] = useState(false)
  const { showAlert, show: showSaveAlert, hide: hideSaveAlert } = useSaveAlert()
  const { title, setTitle, text, setText, insertAtCursor, textareaRef } = useTextController({
    draftKey: NEW_MEMO_DRAFT_KEY,
  })

  const { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave } =
    usePageFlow({
      text,
      title,
      hasChanges,
      draftKey: NEW_MEMO_DRAFT_KEY,
      onSave: () => setHasChanges(false),
      onDiscard: () => setHasChanges(false),
      onValidationError: showSaveAlert,
    })

  const onDictation = useCallback(
    (result: string) => {
      if (!result) return
      insertAtCursor(result + ' ')
    },
    [insertAtCursor],
  )

  const handleSave = useCallback(() => {
    hideSaveAlert()
    saveNote()
  }, [saveNote, hideSaveAlert])

  const handleChangeText = useCallback(
    (value: string) => {
      setText(value)
      setHasChanges(true)
      hideSaveAlert()
    },
    [setText, hideSaveAlert],
  )

  const handleSetTitle = useCallback(
    (value: string) => {
      setTitle(value)
      setHasChanges(true)
      hideSaveAlert()
    },
    [setTitle, hideSaveAlert],
  )

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBEA] text-slate-900">
      <NewMemoHeader
        onBack={handleBack}
        onSave={handleSave}
        saving={saving}
        canSave={text.trim().length > 0 || title.trim().length > 0}
      />

      <div className="mx-auto w-full max-w-3xl px-4 pt-4">
        <TitleInput title={title} onChange={handleSetTitle} />
      </div>

      <SaveAlert show={showAlert} />

      <TextEditor
        text={text}
        onChange={handleChangeText}
        onDictation={onDictation}
        textareaRef={textareaRef}
      />

      <ConfirmDialog
        show={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onDiscard={discardAndLeave}
        onSave={handleSave}
      />
    </div>
  )
}
