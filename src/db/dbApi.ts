import { deriveTitle } from '../helpers/deriveTitle.ts'

import { memosDB } from './db.ts'

export async function countMemos(): Promise<number> {
  try {
    return memosDB.memos.count()
  } catch (error) {
    console.error('Error counting memos:', error)
    return 0
  }
}

export async function createMemo(text: string, title?: string): Promise<number> {
  const now = Date.now()
  try {
    return memosDB.memos.add({
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
