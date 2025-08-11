import { useCallback, useRef, useState } from 'react'

import { deleteMemo } from '@/db/dbApi.ts'

export type DeleteMemoHook = {
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
    if (!selectedMemo.current) {
      console.error('No memo selected for deletion')
      return
    }

    try {
      await deleteMemo(selectedMemo.current)
      await onDelete?.()
      setIsDeleteConfirmShown(false)
      selectedMemo.current = null
    } catch (error) {
      console.error('Failed to delete memo:', error)
    }
  }, [onDelete])

  return {
    isDeleteConfirmShown,
    toggleDeleteConfirmShown,
    selectMemo,
    handleDeleteSelectedMemo,
  }
}
