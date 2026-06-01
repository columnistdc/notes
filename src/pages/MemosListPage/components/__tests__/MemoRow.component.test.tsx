import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MemoRow } from '../MemoRow.tsx'

const memo = {
  id: 1,
  title: 'Test Memo',
  text: 'Some content here',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ul>
    <MemoryRouter>{children}</MemoryRouter>
  </ul>
)

describe('MemoRow', () => {
  it('renders the memo title', () => {
    render(<MemoRow item={memo} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByText('Test Memo')).toBeInTheDocument()
  })

  it('renders a link to the edit page', () => {
    render(<MemoRow item={memo} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByRole('link', { name: /open memo/i })).toHaveAttribute(
      'href',
      '/edit/1',
    )
  })

  it('renders a delete button with an aria-label including the title', () => {
    render(<MemoRow item={memo} onDelete={vi.fn()} />, { wrapper })
    expect(
      screen.getByRole('button', { name: /delete memo "test memo"/i }),
    ).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(<MemoRow item={memo} onDelete={onDelete} />, { wrapper })
    await userEvent.click(screen.getByRole('button', { name: /delete memo/i }))
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it('delete button has type=button', () => {
    render(<MemoRow item={memo} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByRole('button', { name: /delete memo/i })).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('delete button is NOT nested inside the link (valid HTML)', () => {
    render(<MemoRow item={memo} onDelete={vi.fn()} />, { wrapper })
    const link = screen.getByRole('link', { name: /open memo/i })
    const deleteButton = screen.getByRole('button', { name: /delete memo/i })
    expect(link.contains(deleteButton)).toBe(false)
  })

  it('shows "Untitled" when title is empty', () => {
    render(<MemoRow item={{ ...memo, title: '' }} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByText('Untitled')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<MemoRow item={memo} onDelete={vi.fn()} />, { wrapper })
    expect(await axe(container)).toHaveNoViolations()
  })
})
