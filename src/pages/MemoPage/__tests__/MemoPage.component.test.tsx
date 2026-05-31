import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MemoPageMode } from '@/constants.ts'
import { memosDB } from '@/db/db.ts'

import { MemoPage } from '../index.tsx'

vi.mock('@/hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => ({
    isSupported: false,
    listening: false,
    error: null,
    transcript: '',
    start: vi.fn(),
    stop: vi.fn(),
    resetTranscript: vi.fn(),
  }),
}))

const renderCreatePage = () =>
  render(
    <MemoryRouter initialEntries={['/new']}>
      <MemoPage mode={MemoPageMode.Create} />
    </MemoryRouter>,
  )

const getSaveButton = () => screen.getByRole('button', { name: /save/i })

beforeEach(async () => {
  await memosDB.memos.clear()
  localStorage.clear()
})

afterAll(() => {
  memosDB.close()
})

describe('MemoPage — Save button state (create mode)', () => {
  it('Save is disabled when there are no changes', () => {
    renderCreatePage()
    expect(getSaveButton()).toBeDisabled()
  })

  it('Save has no "Saved" indicator initially', () => {
    renderCreatePage()
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('Save becomes enabled after typing in the title', async () => {
    renderCreatePage()
    await userEvent.type(screen.getByLabelText('Title'), 'My memo')
    expect(getSaveButton()).toBeEnabled()
  })

  it('Save becomes enabled after typing in the editor', async () => {
    renderCreatePage()
    await userEvent.type(screen.getByRole('textbox', { name: /memo text editor/i }), 'Hello')
    expect(getSaveButton()).toBeEnabled()
  })

  it('shows a green Saved tick and disables Save after a successful save', async () => {
    renderCreatePage()
    await userEvent.type(screen.getByLabelText('Title'), 'My memo')

    await userEvent.click(getSaveButton())

    await waitFor(() => {
      expect(screen.getByText('Saved')).toBeInTheDocument()
    })
    expect(getSaveButton()).toBeDisabled()

    expect(await memosDB.memos.count()).toBe(1)
  })

  it('hides the Saved tick and re-enables Save when editing again after a save', async () => {
    renderCreatePage()
    await userEvent.type(screen.getByLabelText('Title'), 'My memo')
    await userEvent.click(getSaveButton())
    await waitFor(() => {
      expect(screen.getByText('Saved')).toBeInTheDocument()
    })

    await userEvent.type(screen.getByLabelText('Title'), ' updated')

    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
    expect(getSaveButton()).toBeEnabled()
  })
})
