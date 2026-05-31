import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MemoPageMode } from '@/constants.ts'

import { MemoHeader } from '../MemoHeader.tsx'

const defaults = {
  onBack: vi.fn(),
  onSave: vi.fn(),
  saving: false,
  canSave: true,
  mode: MemoPageMode.Create,
}

describe('MemoHeader', () => {
  it('renders a Back button', () => {
    render(<MemoHeader {...defaults} />)
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('calls onBack when Back is clicked', async () => {
    const onBack = vi.fn()
    render(<MemoHeader {...defaults} onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('calls onSave when Save is clicked', async () => {
    const onSave = vi.fn()
    render(<MemoHeader {...defaults} onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('disables Save when canSave=false', () => {
    render(<MemoHeader {...defaults} canSave={false} />)
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  it('disables Save and shows "Saving…" while saving', () => {
    render(<MemoHeader {...defaults} saving />)
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('shows "New Memo" heading in create mode', () => {
    render(<MemoHeader {...defaults} mode={MemoPageMode.Create} />)
    expect(screen.getByRole('heading', { name: /new memo/i })).toBeInTheDocument()
  })

  it('shows the memo title as heading in edit mode', () => {
    render(
      <MemoHeader {...defaults} mode={MemoPageMode.Edit} title="My important memo" />,
    )
    expect(screen.getByRole('heading', { name: /my important memo/i })).toBeInTheDocument()
  })

  it('falls back to "New Memo" in edit mode when title is empty', () => {
    render(<MemoHeader {...defaults} mode={MemoPageMode.Edit} title="" />)
    expect(screen.getByRole('heading', { name: /new memo/i })).toBeInTheDocument()
  })

  it('Back button has type=button (not submit)', () => {
    render(<MemoHeader {...defaults} />)
    expect(screen.getByRole('button', { name: /back/i })).toHaveAttribute('type', 'button')
  })

  it('has no axe violations', async () => {
    const { container } = render(<MemoHeader {...defaults} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
