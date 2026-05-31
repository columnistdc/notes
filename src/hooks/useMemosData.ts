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

  useEffect(() => {
    // setState is called asynchronously inside refetchItems (after await),
    // not synchronously in the effect body — rule fires a false positive here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetchItems()
  }, [refetchItems])

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
