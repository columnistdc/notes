import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import { useDeleteMemo } from '@/hooks/useDeleteMemo.ts'
import { useMemosData } from '@/hooks/useMemosData.ts'

import { DeleteConfirmDialog } from './components/DeleteConfirmDialog.tsx'
import { EmptyState } from './components/EmptyState.tsx'
import { ListLoading } from './components/ListLoading.tsx'
import { MemoRow } from './components/MemoRow.tsx'

export const MemoListPage = () => {
  const navigate = useNavigate()
  const { items, refetchItems } = useMemosData()
  const { isDeleteConfirmShown, toggleDeleteConfirmShown, selectMemo, handleDeleteSelectedMemo } =
    useDeleteMemo({
      onDelete: refetchItems,
    })

  const handleDeleteClick = (memoId?: number) => {
    if (!memoId) return
    selectMemo(memoId)
    toggleDeleteConfirmShown()
  }

  const handleNewClick = () => navigate('/new')

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBEA] text-slate-900" id="main-content">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <h1 className="text-lg font-semibold">All Memos</h1>
          <div className="ml-auto">
            <Button onClick={handleNewClick} className="px-4 py-1.5">
              New
            </Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-4">
        {items === null ? (
          <div className="rounded-2xl border border-black/5 bg-white/80 shadow-sm">
            <ListLoading />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white/80 shadow-sm">
            <EmptyState />
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((memo) => (
              <MemoRow key={memo.id} item={memo} onDelete={() => handleDeleteClick(memo.id)} />
            ))}
          </ul>
        )}
      </main>

      <DeleteConfirmDialog
        show={isDeleteConfirmShown}
        onCancel={toggleDeleteConfirmShown}
        onConfirm={handleDeleteSelectedMemo}
      />
    </div>
  )
}
