import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'

import { memosDB } from '@/db/db.ts'
import { createMemo, getMemoById } from '@/db/dbApi.ts'
import { useDeleteMemo } from '@/hooks/useDeleteMemo.ts'

beforeEach(async () => {
  await memosDB.memos.clear()
})

afterAll(() => {
  memosDB.close()
})

describe('useDeleteMemo', () => {
  it('starts with confirm dialog hidden', () => {
    const { result } = renderHook(() => useDeleteMemo())
    expect(result.current.isDeleteConfirmShown).toBe(false)
  })

  it('toggleDeleteConfirmShown shows and hides the dialog', () => {
    const { result } = renderHook(() => useDeleteMemo())

    act(() => { result.current.toggleDeleteConfirmShown(); })
    expect(result.current.isDeleteConfirmShown).toBe(true)

    act(() => { result.current.toggleDeleteConfirmShown(); })
    expect(result.current.isDeleteConfirmShown).toBe(false)
  })

  it('deletes the selected memo from the database', async () => {
    const id = await createMemo('To delete')
    const { result } = renderHook(() => useDeleteMemo())

    act(() => { result.current.selectMemo(id); })

    await act(async () => {
      await result.current.handleDeleteSelectedMemo()
    })

    expect(await getMemoById(id)).toBeUndefined()
  })

  it('hides the confirm dialog after successful deletion', async () => {
    const id = await createMemo('Memo')
    const { result } = renderHook(() => useDeleteMemo())

    act(() => {
      result.current.selectMemo(id)
      result.current.toggleDeleteConfirmShown()
    })
    expect(result.current.isDeleteConfirmShown).toBe(true)

    await act(async () => {
      await result.current.handleDeleteSelectedMemo()
    })

    expect(result.current.isDeleteConfirmShown).toBe(false)
  })

  it('calls onDelete callback after successful deletion', async () => {
    const id = await createMemo('Memo')
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeleteMemo({ onDelete }))

    act(() => { result.current.selectMemo(id); })

    await act(async () => {
      await result.current.handleDeleteSelectedMemo()
    })

    expect(onDelete).toHaveBeenCalledOnce()
  })

  it('does nothing when no memo is selected', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeleteMemo({ onDelete }))

    await act(async () => {
      await result.current.handleDeleteSelectedMemo()
    })

    expect(onDelete).not.toHaveBeenCalled()
  })

  it('does not call onDelete when the DB throws', async () => {
    const id = await createMemo('Memo')
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeleteMemo({ onDelete }))

    act(() => { result.current.selectMemo(id); })

    const spy = vi.spyOn(memosDB.memos, 'delete').mockRejectedValueOnce(new Error('DB error'))

    await act(async () => {
      await result.current.handleDeleteSelectedMemo()
    })

    expect(onDelete).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('keeps dialog open when deletion fails', async () => {
    const id = await createMemo('Memo')
    const { result } = renderHook(() => useDeleteMemo())

    act(() => {
      result.current.selectMemo(id)
      result.current.toggleDeleteConfirmShown()
    })

    const spy = vi.spyOn(memosDB.memos, 'delete').mockRejectedValueOnce(new Error('DB error'))

    await act(async () => {
      await result.current.handleDeleteSelectedMemo()
    })

    await waitFor(() => { expect(result.current.isDeleteConfirmShown).toBe(true); })
    spy.mockRestore()
  })
})
