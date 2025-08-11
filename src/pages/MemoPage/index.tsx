import { type FC, useCallback, useState } from 'react'

import type { MemoPageMode } from '@/constants.ts'
import { MEMO_DRAFT_KEY } from '@/constants.ts'
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
  const { title, setTitle, text, setText, insertAtCursor, textareaRef } = useTextController({
    mode,
    draftKey: MEMO_DRAFT_KEY,
  })

  const { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave } =
    usePageFlow({
      text,
      title,
      mode,
      hasChanges,
      draftKey: MEMO_DRAFT_KEY,
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
    <div className="flex min-h-screen flex-col bg-[#FFFBEA] text-slate-900" id="main-content">
      <MemoHeader
        onBack={handleBack}
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
