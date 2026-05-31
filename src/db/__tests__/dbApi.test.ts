import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { memosDB } from '../db.ts'
import {
  countMemos,
  createMemo,
  deleteMemo,
  getMemoById,
  listMemoSummaries,
  MemoConflictError,
  updateMemoById,
} from '../dbApi.ts'

beforeEach(async () => {
  await memosDB.memos.clear()
})

afterAll(() => {
  memosDB.close()
})

// ─── createMemo ──────────────────────────────────────────────────────────────

describe('createMemo', () => {
  it('returns a positive numeric id', async () => {
    const id = await createMemo('Hello world')
    expect(id).toBeGreaterThan(0)
  })

  it('persists the text', async () => {
    const id = await createMemo('My memo text')
    const memo = await memosDB.memos.get(id)
    expect(memo?.text).toBe('My memo text')
  })

  it('derives title from first non-empty line when no title given', async () => {
    const id = await createMemo('First line\nSecond line')
    const memo = await memosDB.memos.get(id)
    expect(memo?.title).toBe('First line')
  })

  it('uses the provided title instead of deriving', async () => {
    const id = await createMemo('Some text', 'Custom Title')
    const memo = await memosDB.memos.get(id)
    expect(memo?.title).toBe('Custom Title')
  })

  it('trims the provided title before storing', async () => {
    const id = await createMemo('Text', '  Padded Title  ')
    const memo = await memosDB.memos.get(id)
    expect(memo?.title).toBe('Padded Title')
  })

  it('sets createdAt and updatedAt to current time', async () => {
    const before = Date.now()
    const id = await createMemo('Test')
    const after = Date.now()
    const memo = await memosDB.memos.get(id)
    expect(memo?.createdAt).toBeGreaterThanOrEqual(before)
    expect(memo?.createdAt).toBeLessThanOrEqual(after)
    expect(memo?.updatedAt).toBeGreaterThanOrEqual(before)
    expect(memo?.updatedAt).toBeLessThanOrEqual(after)
  })

  it('sets createdAt equal to updatedAt on creation', async () => {
    const id = await createMemo('Test')
    const memo = await memosDB.memos.get(id)
    expect(memo?.createdAt).toBe(memo?.updatedAt)
  })
})

// ─── getMemoById ─────────────────────────────────────────────────────────────

describe('getMemoById', () => {
  it('returns the memo for a known id', async () => {
    const id = await createMemo('Known memo')
    const memo = await getMemoById(id)
    expect(memo?.text).toBe('Known memo')
    expect(memo?.id).toBe(id)
  })

  it('returns undefined for a non-existent id', async () => {
    expect(await getMemoById(99999)).toBeUndefined()
  })
})

// ─── updateMemoById ──────────────────────────────────────────────────────────

describe('updateMemoById', () => {
  it('updates text and title', async () => {
    const id = await createMemo('Original', 'Old title')
    await updateMemoById(id, { text: 'Updated text', title: 'New title' })
    const memo = await getMemoById(id)
    expect(memo?.text).toBe('Updated text')
    expect(memo?.title).toBe('New title')
  })

  it('updates updatedAt but not createdAt', async () => {
    const id = await createMemo('Original')
    const original = await getMemoById(id)
    await new Promise((r) => setTimeout(r, 5))
    await updateMemoById(id, { text: 'Updated' })
    const updated = await getMemoById(id)
    expect(updated?.createdAt).toBe(original?.createdAt)
    expect(updated?.updatedAt).toBeGreaterThan(original?.updatedAt ?? 0)
  })

  it('can update only text leaving title unchanged', async () => {
    const id = await createMemo('Text', 'Title')
    await updateMemoById(id, { text: 'New text' })
    const memo = await getMemoById(id)
    expect(memo?.text).toBe('New text')
    expect(memo?.title).toBe('Title')
  })

  // Optimistic locking

  it('succeeds when expectedUpdatedAt matches current value', async () => {
    const id = await createMemo('Original')
    const memo = await getMemoById(id)
    await expect(
      updateMemoById(id, { text: 'Updated' }, memo?.updatedAt),
    ).resolves.toBeUndefined()
  })

  it('throws MemoConflictError when another writer changed updatedAt', async () => {
    const id = await createMemo('Original')
    const snapshot = await getMemoById(id)
    await new Promise((r) => setTimeout(r, 5))
    // Simulate another tab saving — updatedAt advances
    await updateMemoById(id, { text: 'Modified by other tab' })
    // Now save with stale expectedUpdatedAt
    await expect(
      updateMemoById(id, { text: 'My changes' }, snapshot?.updatedAt),
    ).rejects.toBeInstanceOf(MemoConflictError)
  })

  it('does not persist changes when conflict is detected', async () => {
    const id = await createMemo('Original')
    const snapshot = await getMemoById(id)
    await new Promise((r) => setTimeout(r, 5))
    await updateMemoById(id, { text: 'Winner' })
    try {
      await updateMemoById(id, { text: 'Loser' }, snapshot?.updatedAt)
    } catch {
      // expected MemoConflictError
    }
    const memo = await getMemoById(id)
    expect(memo?.text).toBe('Winner')
  })

  it('skips conflict check when expectedUpdatedAt is not provided', async () => {
    const id = await createMemo('Original')
    await updateMemoById(id, { text: 'First save' })
    await expect(
      updateMemoById(id, { text: 'Second save — no conflict check' }),
    ).resolves.toBeUndefined()
  })
})

// ─── deleteMemo ──────────────────────────────────────────────────────────────

describe('deleteMemo', () => {
  it('removes the memo so it can no longer be fetched', async () => {
    const id = await createMemo('To delete')
    await deleteMemo(id)
    expect(await getMemoById(id)).toBeUndefined()
  })

  it('does not throw when deleting a non-existent id', async () => {
    await expect(deleteMemo(99999)).resolves.toBeUndefined()
  })
})

// ─── countMemos ──────────────────────────────────────────────────────────────

describe('countMemos', () => {
  it('returns 0 for an empty database', async () => {
    expect(await countMemos()).toBe(0)
  })

  it('returns the correct count as memos are added', async () => {
    await createMemo('One')
    expect(await countMemos()).toBe(1)
    await createMemo('Two')
    expect(await countMemos()).toBe(2)
  })

  it('decrements after deletion', async () => {
    const id = await createMemo('Will be deleted')
    await createMemo('Will be kept')
    await deleteMemo(id)
    expect(await countMemos()).toBe(1)
  })
})

// ─── listMemoSummaries ───────────────────────────────────────────────────────

describe('listMemoSummaries', () => {
  it('returns an empty array when no memos exist', async () => {
    expect(await listMemoSummaries()).toEqual([])
  })

  it('returns all memos', async () => {
    await createMemo('First')
    await createMemo('Second')
    const memos = await listMemoSummaries()
    expect(memos).toHaveLength(2)
  })

  it('orders by updatedAt descending — newest first', async () => {
    const id1 = await createMemo('First')
    await new Promise((r) => setTimeout(r, 5))
    const id2 = await createMemo('Second')
    const memos = await listMemoSummaries()
    expect(memos[0]?.id).toBe(id2)
    expect(memos[1]?.id).toBe(id1)
  })

  it('re-orders after an edit — updated memo moves to front', async () => {
    const id1 = await createMemo('First')
    await new Promise((r) => setTimeout(r, 5))
    const id2 = await createMemo('Second')
    await new Promise((r) => setTimeout(r, 5))
    await updateMemoById(id1, { text: 'First (edited)' })
    const memos = await listMemoSummaries()
    expect(memos[0]?.id).toBe(id1)
    expect(memos[1]?.id).toBe(id2)
  })
})
