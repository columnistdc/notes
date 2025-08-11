import Button from '@/components/Button.tsx'
import { MemoPageMode } from '@/constants.ts'

type MemoHeaderProps = {
  onBack: () => void
  onSave: () => void
  saving: boolean
  canSave: boolean
  mode: MemoPageMode
  title?: string
}

export const MemoHeader = ({ onBack, onSave, saving, canSave, mode, title }: MemoHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-[rgba(255,165,0,0.5)] bg-white px-3 py-1.5 transition hover:-translate-y-px hover:shadow"
        >
          <span className="inline-block">←</span>
          <span>Back</span>
        </button>
        <h1 className="ml-2 text-lg font-semibold">
          {mode === MemoPageMode.Edit && title ? title : 'New Memo'}
        </h1>
        <div className="ml-auto">
          <Button onClick={onSave} disabled={!canSave || saving} className="px-4 py-1.5">
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </header>
  )
}
