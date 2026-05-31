import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { SaveAlert } from '../SaveAlert.tsx'

describe('SaveAlert', () => {
  it('renders nothing when show=false', () => {
    render(<SaveAlert show={false} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders with role=alert when show=true', () => {
    render(<SaveAlert show />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows the default validation message', () => {
    render(<SaveAlert show />)
    expect(screen.getByText(/fill in the title or text/i)).toBeInTheDocument()
  })

  it('shows a custom message', () => {
    render(<SaveAlert show message="Custom error message" />)
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('applies warning styles by default', () => {
    render(<SaveAlert show />)
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('amber')
  })

  it('applies error styles when variant=error', () => {
    render(<SaveAlert show variant="error" />)
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('red')
  })

  it('has no axe violations (warning variant)', async () => {
    const { container } = render(<SaveAlert show />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (error variant)', async () => {
    const { container } = render(<SaveAlert show variant="error" message="Failed to save" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
