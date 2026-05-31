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

  return {
    items,
    loadError,
    refetchItems,
  }
}
