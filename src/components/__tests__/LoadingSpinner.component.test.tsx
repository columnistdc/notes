import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { LoadingSpinner } from '../LoadingSpinner.tsx'

describe('LoadingSpinner', () => {
  it('renders with role=status', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows the default loading text', () => {
    render(<LoadingSpinner />)
    expect(screen.getAllByText('Loading...')).toHaveLength(2) // visible + sr-only
  })

  it('shows a custom text', () => {
    render(<LoadingSpinner text="Loading memos..." />)
    expect(screen.getAllByText('Loading memos...')).toHaveLength(2)
  })

  it('renders inside a full-screen container when fullScreen=true', () => {
    const { container } = render(<LoadingSpinner fullScreen />)
    expect(container.firstChild).toHaveClass('min-h-screen')
  })

  it('does not add full-screen wrapper by default', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.firstChild).not.toHaveClass('min-h-screen')
  })

  it('has no axe violations', async () => {
    const { container } = render(<LoadingSpinner />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
