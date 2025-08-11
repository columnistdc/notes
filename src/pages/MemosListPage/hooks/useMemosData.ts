import { useCallback, useEffect, useState } from 'react'

import { listMemoSummaries } from '@/db/dbApi.ts'
import type { Memo } from '@/db/types.ts'

export type MemosData = {
  items: Memo[] | null
  refetchItems: () => Promise<void>
}

export function useMemosData(): MemosData {
  const [items, setItems] = useState<Memo[] | null>(null)

  const refetchItems = useCallback(async () => {
    const data = await listMemoSummaries()
    setItems(data)
  }, [])

  useEffect(() => {
    refetchItems()
  }, [refetchItems])

  return {
    items,
    refetchItems,
  }
}
