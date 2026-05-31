import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'

import { memosDB } from '@/db/db.ts'
import * as dbApi from '@/db/dbApi.ts'
import { createMemo, deleteMemo, updateMemoById } from '@/db/dbApi.ts'
import { useMemosData } from '@/hooks/useMemosData.ts'

beforeEach(async () => {
  await memosDB.memos.clear()
})

afterAll(() => {
  memosDB.close()
})

describe('useMemosData', () => {
  it('starts with items null (loading state)', () => {
    const { result } = renderHook(() => useMemosData())
    expect(result.current.items).toBeNull()
    expect(result.current.loadError).toBe(false)
  })

  it('loads memos from the database on mount', async () => {
    await createMemo('First memo')
    await createMemo('Second memo')

    const { result } = renderHook(() => useMemosData())

    await waitFor(() => expect(result.current.items).not.toBeNull())
    expect(result.current.items).toHaveLength(2)
  })

  it('returns memos ordered by updatedAt descending', async () => {
    const id1 = await createMemo('Older')
    await new Promise((r) => setTimeout(r, 5))
    await createMemo('Newer')

    const { result } = renderHook(() => useMemosData())

    await waitFor(() => expect(result.current.items).toHaveLength(2))
    expect(result.current.items?.[0].id).not.toBe(id1)
  })

  it('sets loadError when the DB call fails', async () => {
    // listMemoSummaries swallows Dexie errors internally, so we mock
    // the function itself to simulate a rejection reaching the hook.
    const spy = vi
      .spyOn(dbApi, 'listMemoSummaries')
      .mockRejectedValueOnce(new Error('DB error'))

    const { result } = renderHook(() => useMemosData())

    await waitFor(() => expect(result.current.loadError).toBe(true))
    expect(result.current.items).toBeNull()
    spy.mockRestore()
  })

  it('clears loadError and shows items after a successful refetch', async () => {
    const spy = vi
      .spyOn(dbApi, 'listMemoSummaries')
      .mockRejectedValueOnce(new Error('DB error'))

    const { result } = renderHook(() => useMemosData())
    await waitFor(() => expect(result.current.loadError).toBe(true))
    spy.mockRestore()

    await act(async () => {
      await result.current.refetchItems()
    })

    expect(result.current.loadError).toBe(false)
  })

  it('refetchItems updates the list after a new memo is created', async () => {
    const { result } = renderHook(() => useMemosData())
    await waitFor(() => expect(result.current.items).toHaveLength(0))

    await createMemo('New memo')

    await act(async () => {
      await result.current.refetchItems()
    })

    expect(result.current.items).toHaveLength(1)
  })

  it('refetchItems reflects a deletion', async () => {
    const id = await createMemo('To delete')
    const { result } = renderHook(() => useMemosData())
    await waitFor(() => expect(result.current.items).toHaveLength(1))

    await deleteMemo(id)

    await act(async () => {
      await result.current.refetchItems()
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('refetches when the tab becomes visible', async () => {
    const { result } = renderHook(() => useMemosData())
    await waitFor(() => expect(result.current.items).toHaveLength(0))

    await createMemo('Added in another tab')

    // Simulate tab becoming visible
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    })
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    await waitFor(() => expect(result.current.items).toHaveLength(1))
  })

  it('does not refetch when tab becomes hidden', async () => {
    const { result } = renderHook(() => useMemosData())
    await waitFor(() => expect(result.current.items).toHaveLength(0))

    await createMemo('Should not appear')

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    })
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    // Give it time to potentially (wrongly) fetch
    await new Promise((r) => setTimeout(r, 50))
    expect(result.current.items).toHaveLength(0)

    // Restore
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true })
  })
})

describe('useMemosData — updatedAt ordering after edit', () => {
  it('moves an edited memo to the front of the list', async () => {
    const id1 = await createMemo('First')
    await new Promise((r) => setTimeout(r, 5))
    await createMemo('Second')

    const { result } = renderHook(() => useMemosData())
    await waitFor(() => expect(result.current.items).toHaveLength(2))
    expect(result.current.items?.[0].id).not.toBe(id1)

    await new Promise((r) => setTimeout(r, 5))
    await updateMemoById(id1, { text: 'First (edited)' })

    await act(async () => {
      await result.current.refetchItems()
    })

    expect(result.current.items?.[0].id).toBe(id1)
  })
})
