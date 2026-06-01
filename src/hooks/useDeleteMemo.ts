import { useCallback, useRef, useState } from 'react'

import { deleteMemo } from '@/db/dbApi.ts'

interface DeleteMemoHook {
  isDeleteConfirmShown: boolean
  toggleDeleteConfirmShown: () => void
  selectMemo: (memoId: number) => void
  handleDeleteSelectedMemo: () => Promise<void>
}

interface UseDeleteMemoOptions {
  onDelete?: () => Promise<void>
}

export function useDeleteMemo(options: UseDeleteMemoOptions = {}): DeleteMemoHook {
  const { onDelete } = options
  const [isDeleteConfirmShown, setIsDeleteConfirmShown] = useState(false)
  const selectedMemo = useRef<number | null>(null)

  const toggleDeleteConfirmShown = useCallback(() => {
    setIsDeleteConfirmShown((prev) => !prev)
  }, [])

  const selectMemo = useCallback((memoId: number) => {
    selectedMemo.current = memoId
  }, [])

  const handleDeleteSelectedMemo = useCallback(async () => {
    const memoId = selectedMemo.current
    if (!memoId) {
      console.error('Cannot delete memo: No memo ID selected')
      return
    }

    try {
      await deleteMemo(memoId)
      await onDelete?.()
      setIsDeleteConfirmShown(false)
      selectedMemo.current = null
    } catch (error) {
      console.error(`Failed to delete memo ID ${String(memoId)}:`, error)
    }
  }, [onDelete])

  return {
    isDeleteConfirmShown,
    toggleDeleteConfirmShown,
    selectMemo,
    handleDeleteSelectedMemo,
  }
}
