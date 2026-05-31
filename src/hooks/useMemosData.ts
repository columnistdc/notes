import { useCallback, useEffect, useState } from 'react'

import { listMemoSummaries } from '@/db/dbApi.ts'
import type { Memo } from '@/db/types.ts'

interface MemosData {
  items: Memo[] | null
  refetchItems: () => Promise<void>
}

export function useMemosData(): MemosData {
  const [items, setItems] = useState<Memo[] | null>(null)

  const refetchItems = useCallback(async () => {
    const memos = await listMemoSummaries()
    setItems(memos)
  }, [])

  useEffect(() => {
    void refetchItems()
  }, [refetchItems])

  return {
    items,
    refetchItems,
  }
}
