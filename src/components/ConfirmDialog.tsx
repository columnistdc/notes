import Button from '@/components/Button.tsx'
import { DialogShell } from '@/components/DialogShell.tsx'

type ConfirmDialogProps = {
  show: boolean
  onCancel: () => void
  onDiscard: () => void
  onSave: () => void
}

export const ConfirmDialog = ({ show, onCancel, onDiscard, onSave }: ConfirmDialogProps) => {
  if (!show) return null

  return (
    <DialogShell labelId="confirm-dialog-title" onClose={onCancel}>
      <h2 id="confirm-dialog-title" className="mb-2 text-lg font-semibold">
        Save memo?
      </h2>
      <p className="mb-4 text-slate-600">
        You have unsaved changes. Do you want to save the memo before leaving?
      </p>
      <div className="flex flex-wrap justify-end gap-3">
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onDiscard}>Don't save</Button>
        <Button onClick={onSave} className="px-5">
          Save
        </Button>
      </div>
    </DialogShell>
  )
}
