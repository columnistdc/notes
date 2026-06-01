import type { Memo } from '@/db/types.ts'
import { deriveTitle } from '@/helpers/deriveTitle.ts'

import { memosDB } from './db.ts'

export async function countMemos(): Promise<number> {
  try {
    return await memosDB.memos.count()
  } catch (error) {
    console.error('Error counting memos:', error)
    return 0
  }
}

export async function createMemo(text: string, title?: string): Promise<number> {
  const now = Date.now()
  try {
    return await memosDB.memos.add({
      text,
      createdAt: now,
      updatedAt: now,
      title: title?.trim() || deriveTitle(text),
    })
  } catch (error) {
    console.error('Error creating memo:', error)
    throw new Error('Failed to create memo')
  }
}

export async function deleteMemo(id: number): Promise<void> {
  try {
    await memosDB.memos.delete(id)
  } catch (error) {
    console.error('Error deleting memo:', error)
    throw new Error('Failed to delete memo')
  }
}

export async function getMemoById(id: number): Promise<Memo | undefined> {
  try {
    return await memosDB.memos.get(id)
  } catch (error) {
    console.error('Error getting memo by id:', error)
    return undefined
  }
}

export class MemoConflictError extends Error {
  constructor() {
    super('Memo was modified in another tab')
    this.name = 'MemoConflictError'
  }
}

export async function updateMemoById(
  id: number,
  updates: Partial<Pick<Memo, 'text' | 'title'>>,
  expectedUpdatedAt?: number,
): Promise<void> {
  try {
    const now = Date.now()
    await memosDB.transaction('rw', memosDB.memos, async () => {
      if (expectedUpdatedAt !== undefined) {
        const current = await memosDB.memos.get(id)
        if (current && current.updatedAt !== expectedUpdatedAt) {
          throw new MemoConflictError()
        }
      }
      await memosDB.memos.update(id, { ...updates, updatedAt: now })
    })
  } catch (error) {
    if (error instanceof MemoConflictError) throw error
    console.error('Error updating memo by id:', error)
    throw new Error('Failed to update memo')
  }
}

export async function listMemoSummaries(): Promise<Memo[]> {
  try {
    return await memosDB.memos.orderBy('updatedAt').reverse().toArray()
  } catch (error) {
    console.error('Error listing memos:', error)
    return []
  }
}
