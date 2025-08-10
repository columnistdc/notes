import { useCallback } from 'react'

import ConfirmDialog from './components/ConfirmDialog.tsx'
import NewMemoHeader from './components/NewMemoHeader.tsx'
import TextEditor from './components/TextEditor.tsx'
import TitleInput from './components/TitleInput.tsx'
import usePageFlow from './hooks/usePageFlow.ts'
import useTextController from './hooks/useTextController.ts'

const NEW_MEMO_DRAFT_KEY = 'new-memo-draft-v1'

export const NewMemoPage = () => {
  const { title, setTitle, text, setText, dirty, markClean, insertAtCursor, textareaRef } =
    useTextController({
      draftKey: NEW_MEMO_DRAFT_KEY,
    })

  const { saving, showConfirm, setShowConfirm, handleBack, saveNote, discardAndLeave } =
    usePageFlow({
      text,
      title,
      dirty,
      draftKey: NEW_MEMO_DRAFT_KEY,
      onSave: markClean,
      onDiscard: markClean,
    })

  const onDictation = useCallback(
    (result: string) => {
      if (!result) return
      insertAtCursor(result + ' ')
    },
    [insertAtCursor],
  )

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBEA] text-slate-900">
      <NewMemoHeader
        onBack={handleBack}
        onSave={saveNote}
        saving={saving}
        canSave={text.trim().length > 0}
      />

      <div className="mx-auto w-full max-w-3xl px-4 pt-4">
        <TitleInput title={title} onChange={setTitle} />
      </div>

      <TextEditor
        text={text}
        onChange={setText}
        onDictation={onDictation}
        textareaRef={textareaRef}
      />

      <ConfirmDialog
        show={!!showConfirm}
        onCancel={() => setShowConfirm(null)}
        onDiscard={discardAndLeave}
        onSave={saveNote}
      />
    </div>
  )
}
