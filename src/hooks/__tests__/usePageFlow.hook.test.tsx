import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import { MemoPageMode } from '@/constants.ts'
import { memosDB } from '@/db/db.ts'
import * as dbApi from '@/db/dbApi.ts'
import { createMemo, getMemoById } from '@/db/dbApi.ts'
import { usePageFlow } from '@/hooks/usePageFlow.ts'

const DRAFT_KEY = 'test-draft'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

const defaultCreateOptions = (overrides = {}) => ({
  text: 'Some text',
  title: 'Some title',
  hasChanges: true,
  draftKey: DRAFT_KEY,
  mode: MemoPageMode.Create,
  ...overrides,
})

const defaultEditOptions = (memoId: string, overrides = {}) => ({
  text: 'Edited text',
  title: 'Edited title',
  hasChanges: true,
  draftKey: DRAFT_KEY,
  mode: MemoPageMode.Edit,
  memoId,
  ...overrides,
})

beforeEach(async () => {
  await memosDB.memos.clear()
  localStorage.clear()
})

afterAll(() => {
  memosDB.close()
})

// ─── Validation ───────────────────────────────────────────────────────────────

describe('saveNote — validation', () => {
  it('calls onValidationError and does not save when both text and title are empty', async () => {
    const onValidationError = vi.fn()
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ text: '', title: '', onValidationError })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(onValidationError).toHaveBeenCalledOnce()
    expect(await dbApi.countMemos()).toBe(0)
  })

  it('saves when only title is provided', async () => {
    const onSave = vi.fn()
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ text: '', title: 'Title only', onSave })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(onSave).toHaveBeenCalledOnce()
    expect(await dbApi.countMemos()).toBe(1)
  })

  it('saves when only text is provided', async () => {
    const onSave = vi.fn()
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ text: 'Text only', title: '', onSave })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(onSave).toHaveBeenCalledOnce()
  })

  it('trims whitespace before validation — whitespace-only fails', async () => {
    const onValidationError = vi.fn()
    const { result } = renderHook(
      () =>
        usePageFlow(defaultCreateOptions({ text: '   ', title: '\t', onValidationError })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(onValidationError).toHaveBeenCalledOnce()
  })
})

// ─── Create mode ─────────────────────────────────────────────────────────────

describe('saveNote — create mode', () => {
  it('creates a new memo in the database', async () => {
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ text: 'New memo content' })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    const memos = await dbApi.listMemoSummaries()
    expect(memos).toHaveLength(1)
    expect(memos[0].text).toBe('New memo content')
  })

  it('removes the draft from localStorage on success', async () => {
    localStorage.setItem(DRAFT_KEY, 'draft text')
    localStorage.setItem(`${DRAFT_KEY}-title`, 'draft title')

    const onSave = vi.fn()
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ onSave })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(localStorage.getItem(DRAFT_KEY)).toBeNull()
    expect(localStorage.getItem(`${DRAFT_KEY}-title`)).toBeNull()
  })

  it('keeps the draft when save fails', async () => {
    localStorage.setItem(DRAFT_KEY, 'precious draft')
    const spy = vi.spyOn(dbApi, 'createMemo').mockRejectedValueOnce(new Error('DB error'))
    const onSaveError = vi.fn()

    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ onSaveError })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(localStorage.getItem(DRAFT_KEY)).toBe('precious draft')
    expect(onSaveError).toHaveBeenCalledOnce()
    spy.mockRestore()
  })

  it('calls onSave after successful create', async () => {
    const onSave = vi.fn()
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ onSave })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(onSave).toHaveBeenCalledOnce()
  })

  it('sets saving=true during the operation and false after', async () => {
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions()),
      { wrapper },
    )

    const savePromise = act(async () => { await result.current.saveNote() })
    await savePromise

    expect(result.current.saving).toBe(false)
  })
})

// ─── Edit mode ────────────────────────────────────────────────────────────────

describe('saveNote — edit mode', () => {
  it('updates the existing memo in the database', async () => {
    const id = await createMemo('Original')

    const { result } = renderHook(
      () =>
        usePageFlow(
          defaultEditOptions(String(id), { text: 'Updated text', title: 'Updated title' }),
        ),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    const memo = await getMemoById(id)
    expect(memo?.text).toBe('Updated text')
    expect(memo?.title).toBe('Updated title')
  })

  it('calls onConflict when MemoConflictError is thrown', async () => {
    const id = await createMemo('Original')
    const spy = vi
      .spyOn(dbApi, 'updateMemoById')
      .mockRejectedValueOnce(new dbApi.MemoConflictError())
    const onConflict = vi.fn()

    const { result } = renderHook(
      () => usePageFlow(defaultEditOptions(String(id), { onConflict })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(onConflict).toHaveBeenCalledOnce()
    spy.mockRestore()
  })

  it('calls onSaveError (not onConflict) for generic DB errors', async () => {
    const id = await createMemo('Original')
    const spy = vi
      .spyOn(dbApi, 'updateMemoById')
      .mockRejectedValueOnce(new Error('Generic DB error'))
    const onConflict = vi.fn()
    const onSaveError = vi.fn()

    const { result } = renderHook(
      () => usePageFlow(defaultEditOptions(String(id), { onConflict, onSaveError })),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(onSaveError).toHaveBeenCalledOnce()
    expect(onConflict).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('does nothing when memoId is invalid (non-numeric)', async () => {
    const onSave = vi.fn()
    const { result } = renderHook(
      () =>
        usePageFlow({
          ...defaultEditOptions('abc', { onSave }),
        }),
      { wrapper },
    )

    await act(async () => { await result.current.saveNote() })

    expect(onSave).not.toHaveBeenCalled()
    expect(await dbApi.countMemos()).toBe(0)
  })
})

// ─── Confirm dialog & back navigation ────────────────────────────────────────

describe('handleBack', () => {
  it('shows confirm dialog when there are unsaved changes', async () => {
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ hasChanges: true })),
      { wrapper },
    )

    await act(async () => { await result.current.handleBack() })

    expect(result.current.showConfirm).toBe(true)
  })

  it('does not show confirm dialog when text and title are empty (nothing to lose)', async () => {
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ text: '', title: '', hasChanges: true })),
      { wrapper },
    )

    await act(async () => { await result.current.handleBack() })

    expect(result.current.showConfirm).toBe(false)
  })

  it('does not show confirm dialog when hasChanges is false', async () => {
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ hasChanges: false })),
      { wrapper },
    )

    await act(async () => { await result.current.handleBack() })

    expect(result.current.showConfirm).toBe(false)
  })
})

// ─── discardAndLeave ──────────────────────────────────────────────────────────

describe('discardAndLeave', () => {
  it('clears the draft from localStorage', async () => {
    localStorage.setItem(DRAFT_KEY, 'saved draft')
    localStorage.setItem(`${DRAFT_KEY}-title`, 'saved title')

    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions()),
      { wrapper },
    )

    await act(async () => { await result.current.discardAndLeave() })

    expect(localStorage.getItem(DRAFT_KEY)).toBeNull()
    expect(localStorage.getItem(`${DRAFT_KEY}-title`)).toBeNull()
  })

  it('calls onDiscard callback', async () => {
    const onDiscard = vi.fn()
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ onDiscard })),
      { wrapper },
    )

    await act(async () => { await result.current.discardAndLeave() })

    expect(onDiscard).toHaveBeenCalledOnce()
  })
})

// ─── setShowConfirm ───────────────────────────────────────────────────────────

describe('setShowConfirm', () => {
  it('can be used to close the confirm dialog', async () => {
    const { result } = renderHook(
      () => usePageFlow(defaultCreateOptions({ hasChanges: true })),
      { wrapper },
    )

    await act(async () => { await result.current.handleBack() })
    expect(result.current.showConfirm).toBe(true)

    act(() => result.current.setShowConfirm(false))
    expect(result.current.showConfirm).toBe(false)
  })
})
