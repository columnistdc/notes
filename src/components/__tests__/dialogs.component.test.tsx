import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DeleteConfirmDialog } from '../../pages/MemosListPage/components/DeleteConfirmDialog.tsx'
import { ConfirmDialog } from '../ConfirmDialog.tsx'

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

describe('ConfirmDialog', () => {
  const defaults = {
    show: true,
    onCancel: vi.fn(),
    onDiscard: vi.fn(),
    onSave: vi.fn(),
  }

  it('renders nothing when show=false', () => {
    render(<ConfirmDialog {...defaults} show={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders with role=dialog when show=true', () => {
    render(<ConfirmDialog {...defaults} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal=true', () => {
    render(<ConfirmDialog {...defaults} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('is labelled by the heading', () => {
    render(<ConfirmDialog {...defaults} />)
    const dialog = screen.getByRole('dialog')
    const heading = screen.getByRole('heading', { name: /save memo/i })
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id)
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaults} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it("calls onDiscard when Don't save is clicked", async () => {
    const onDiscard = vi.fn()
    render(<ConfirmDialog {...defaults} onDiscard={onDiscard} />)
    await userEvent.click(screen.getByRole('button', { name: /don't save/i }))
    expect(onDiscard).toHaveBeenCalledOnce()
  })

  it('calls onSave when Save is clicked', async () => {
    const onSave = vi.fn()
    render(<ConfirmDialog {...defaults} onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }))
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Escape is pressed', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaults} onCancel={onCancel} />)
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('wraps Tab focus from last button back to first (focus trap)', async () => {
    render(<ConfirmDialog {...defaults} />)
    const buttons = screen.getAllByRole('button')
    const first = buttons[0]
    const last = buttons[buttons.length - 1]
    if (!first || !last) throw new Error('expected focusable buttons in dialog')

    // Put focus on the last button, then Tab — should wrap to first
    last.focus()
    expect(document.activeElement).toBe(last)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(first)
  })

  it('has no axe violations', async () => {
    const { container } = render(<ConfirmDialog {...defaults} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ─── DeleteConfirmDialog ──────────────────────────────────────────────────────

describe('DeleteConfirmDialog', () => {
  const defaults = {
    show: true,
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
  }

  it('renders nothing when show=false', () => {
    render(<DeleteConfirmDialog {...defaults} show={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders with role=dialog when show=true', () => {
    render(<DeleteConfirmDialog {...defaults} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('calls onCancel when No is clicked', async () => {
    const onCancel = vi.fn()
    render(<DeleteConfirmDialog {...defaults} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /no/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onConfirm when Yes is clicked', async () => {
    const onConfirm = vi.fn()
    render(<DeleteConfirmDialog {...defaults} onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: /yes/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Escape is pressed', async () => {
    const onCancel = vi.fn()
    render(<DeleteConfirmDialog {...defaults} onCancel={onCancel} />)
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('has no axe violations', async () => {
    const { container } = render(<DeleteConfirmDialog {...defaults} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
