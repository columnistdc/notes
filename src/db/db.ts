import Dexie, { type Table } from 'dexie'

import type { Memo } from './types.ts'

class MemosDB extends Dexie {
  memos!: Table<Memo, number>

  constructor() {
    super('voice-memos')
    this.version(1).stores({
      memos: '++id, updatedAt, createdAt, title',
      memos_audio: '++id, memoId, createdAt',
    })
  }
}

export const memosDB = new MemosDB()
