import type React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'

import { MemoPageMode } from '@/constants.ts'
import { memosDB } from '@/db/db.ts'
import { createMemo } from '@/db/dbApi.ts'
import { useTextController } from '@/hooks/useTextController.ts'

const DRAFT_KEY = 'test-draft'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

beforeEach(async () => {
  await memosDB.memos.clear()
  localStorage.clear()
})

afterAll(() => {
  memosDB.close()
})

// ─── Create mode — draft initialisation ──────────────────────────────────────

describe('create mode — draft initialisation', () => {
  it('starts with empty text and title when no draft exists', () => {
    const { result } = renderHook(
      () => useTextController({ mode: MemoPageMode.Create, draftKey: DRAFT_KEY }),
      { wrapper },
    )
    expect(result.current.text).toBe('')
    expect(result.current.title).toBe('')
  })

  it('restores text and title from localStorage on mount', () => {
    localStorage.setItem(DRAFT_KEY, 'saved text')
    localStorage.setItem(`${DRAFT_KEY}-title`, 'saved title')

    const { result } = renderHook(
      () => useTextController({ mode: MemoPageMode.Create, draftKey: DRAFT_KEY }),
      { wrapper },
    )

    expect(result.current.text).toBe('saved text')
    expect(result.current.title).toBe('saved title')
  })

  it('restores an explicitly empty text draft (not treated as missing)', () => {
    localStorage.setItem(DRAFT_KEY, '')
    localStorage.setItem(`${DRAFT_KEY}-title`, 'title only')

    const { result } = renderHook(
      () => useTextController({ mode: MemoPageMode.Create, draftKey: DRAFT_KEY }),
      { wrapper },
    )

    expect(result.current.text).toBe('')
    expect(result.current.title).toBe('title only')
  })
})

// ─── Create mode — draft auto-save ───────────────────────────────────────────

describe('create mode — draft auto-save', () => {
  it('persists text to localStorage after debounce', async () => {
    const { result } = renderHook(
      () => useTextController({ mode: MemoPageMode.Create, draftKey: DRAFT_KEY }),
      { wrapper },
    )

    act(() => { result.current.setText('new content'); })

    await new Promise((r) => setTimeout(r, 350))

    expect(localStorage.getItem(DRAFT_KEY)).toBe('new content')
  })

  it('persists title to localStorage after debounce', async () => {
    const { result } = renderHook(
      () => useTextController({ mode: MemoPageMode.Create, draftKey: DRAFT_KEY }),
      { wrapper },
    )

    act(() => { result.current.setTitle('my title'); })

    await new Promise((r) => setTimeout(r, 350))

    expect(localStorage.getItem(`${DRAFT_KEY}-title`)).toBe('my title')
  })

  it('does not save to localStorage if content has not changed from initial', async () => {
    localStorage.setItem(DRAFT_KEY, 'existing')

    renderHook(
      () => useTextController({ mode: MemoPageMode.Create, draftKey: DRAFT_KEY }),
      { wrapper },
    )

    await new Promise((r) => setTimeout(r, 350))

    expect(localStorage.getItem(DRAFT_KEY)).toBe('existing')
  })
})

// ─── Edit mode — memo loading ─────────────────────────────────────────────────

describe('edit mode — memo loading', () => {
  it('loads memo text and title from the database', async () => {
    const id = await createMemo('DB text', 'DB title')

    const { result } = renderHook(
      () =>
        useTextController({
          mode: MemoPageMode.Edit,
          draftKey: DRAFT_KEY,
          memoId: String(id),
        }),
      { wrapper },
    )

    await waitFor(() => { expect(result.current.text).toBe('DB text'); })
    expect(result.current.title).toBe('DB title')
  })

  it('records loadedUpdatedAt from the fetched memo', async () => {
    const id = await createMemo('Text', 'Title')
    const memo = await memosDB.memos.get(id)

    const { result } = renderHook(
      () =>
        useTextController({
          mode: MemoPageMode.Edit,
          draftKey: DRAFT_KEY,
          memoId: String(id),
        }),
      { wrapper },
    )

    await waitFor(() => { expect(result.current.loadedUpdatedAt.current).toBeDefined(); })
    expect(result.current.loadedUpdatedAt.current).toBe(memo?.updatedAt)
  })

  it('does not write to localStorage in edit mode', async () => {
    const id = await createMemo('Text', 'Title')

    const { result } = renderHook(
      () =>
        useTextController({
          mode: MemoPageMode.Edit,
          draftKey: DRAFT_KEY,
          memoId: String(id),
        }),
      { wrapper },
    )

    await waitFor(() => { expect(result.current.text).toBe('Text'); })
    act(() => { result.current.setText('Modified'); })

    await new Promise((r) => setTimeout(r, 350))

    expect(localStorage.getItem(DRAFT_KEY)).toBeNull()
  })
})

// ─── Edit mode — navigation on bad IDs ───────────────────────────────────────

describe('edit mode — invalid or missing memoId', () => {
  it('does not load text when memoId is non-numeric (navigates away)', async () => {
    const { result } = renderHook(
      () =>
        useTextController({
          mode: MemoPageMode.Edit,
          draftKey: DRAFT_KEY,
          memoId: 'not-a-number',
        }),
      { wrapper },
    )

    await new Promise((r) => setTimeout(r, 100))
    expect(result.current.text).toBe('')
  })

  it('does not load text when memo does not exist in DB (navigates away)', async () => {
    const { result } = renderHook(
      () =>
        useTextController({
          mode: MemoPageMode.Edit,
          draftKey: DRAFT_KEY,
          memoId: '99999',
        }),
      { wrapper },
    )

    await new Promise((r) => setTimeout(r, 100))
    expect(result.current.text).toBe('')
  })
})

// ─── insertAtCursor ───────────────────────────────────────────────────────────

describe('insertAtCursor', () => {
  it('is a no-op when textareaRef has no element', () => {
    const { result } = renderHook(
      () => useTextController({ mode: MemoPageMode.Create, draftKey: DRAFT_KEY }),
      { wrapper },
    )

    act(() => { result.current.insertAtCursor('hello'); })

    expect(result.current.text).toBe('')
  })
})
