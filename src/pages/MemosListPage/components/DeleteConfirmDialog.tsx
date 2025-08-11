import Button from '@/components/Button'

type DeleteConfirmDialogProps = {
  show: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const DeleteConfirmDialog = ({ show, onCancel, onConfirm }: DeleteConfirmDialogProps) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold">Delete memo?</h2>
        <p className="mb-4 text-slate-600">
          Are you sure you want to delete this memo? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel}>No</Button>
          <Button onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700">
            Yes
          </Button>
        </div>
      </div>
    </div>
  )
}
