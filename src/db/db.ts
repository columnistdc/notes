import Dexie, { type Table } from 'dexie'

import type { Memo } from './types.ts'

class MemosDB extends Dexie {
  memos!: Table<Memo, number>

  constructor() {
    super('voice-memos')
    this.version(1).stores({
      memos: '++id, updatedAt, createdAt, title',
    })
  }
}

export const memosDB = new MemosDB()

export async function checkDbAvailable(): Promise<boolean> {
  try {
    await memosDB.open()
    return true
  } catch {
    return false
  }
}
