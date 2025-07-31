import { memosDB } from './db.ts'

export async function countMemos(): Promise<number> {
  return memosDB.memos.count()
}
