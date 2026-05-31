import { useCallback, useEffect, useState } from 'react'

import { listMemoSummaries } from '@/db/dbApi.ts'
import type { Memo } from '@/db/types.ts'

interface MemosData {
  items: Memo[] | null
  loadError: boolean
  refetchItems: () => Promise<void>
}

export function useMemosData(): MemosData {
  const [items, setItems] = useState<Memo[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  const refetchItems = useCallback(async () => {
    try {
      const memos = await listMemoSummaries()
      setItems(memos)
      setLoadError(false)
    } catch {
      setLoadError(true)
    }
  }, [])

  // Initial load. Inlined (rather than calling refetchItems) so state is only
  // set after the await — and guarded so we never set state after unmount.
  useEffect(() => {
    let active = true
    listMemoSummaries()
      .then((memos) => {
        if (!active) return
        setItems(memos)
        setLoadError(false)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
    return () => {
      active = false
    }
  }, [])

  // Refetch when the tab becomes visible so changes made in another tab
  // (create, edit, delete) are reflected without requiring a manual reload.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refetchItems()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => { document.removeEventListener('visibilitychange', handleVisibilityChange); }
  }, [refetchItems])

  return {
    items,
    loadError,
    refetchItems,
  }
}
