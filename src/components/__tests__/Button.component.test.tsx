import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Button from '../Button.tsx'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('defaults to type=button', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('calls onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('lets a consumer className override the base background', () => {
    render(
      <Button className="bg-red-600 text-white">
        Yes
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Yes' })
    expect(button).toHaveClass('bg-red-600')
    expect(button).toHaveClass('text-white')
    expect(button).not.toHaveClass('bg-white')
  })

  it('keeps the base background when no override is given', () => {
    render(<Button>Plain</Button>)
    expect(screen.getByRole('button', { name: 'Plain' })).toHaveClass('bg-white')
  })
})
