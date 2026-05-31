import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FabMic from '../FabMic.tsx'

// useSpeechRecognition uses the Web Speech API which is unavailable in jsdom.
// We mock the whole hook to control isSupported / listening / error states.
vi.mock('@/hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: vi.fn(() => ({
    isSupported: true,
    listening: false,
    error: null,
    transcript: '',
    start: vi.fn(),
    stop: vi.fn(),
    resetTranscript: vi.fn(),
  })),
}))

import { useSpeechRecognition } from '@/hooks/useSpeechRecognition.ts'

const mockHook = vi.mocked(useSpeechRecognition)

const resetMock = (overrides = {}) =>
  mockHook.mockReturnValue({
    isSupported: true,
    listening: false,
    error: null,
    transcript: '',
    start: vi.fn(),
    stop: vi.fn(),
    resetTranscript: vi.fn(),
    ...overrides,
  })

describe('FabMic', () => {
  it('renders the mic button when speech recognition is supported', () => {
    resetMock()
    render(<FabMic onResult={vi.fn()} />)
    expect(screen.getByRole('button', { name: /start voice dictation/i })).toBeInTheDocument()
  })

  it('shows "not supported" alert when speech recognition is unavailable', () => {
    resetMock({ isSupported: false })
    render(<FabMic onResult={vi.fn()} />)
    expect(screen.getByRole('alert')).toHaveTextContent(/not supported/i)
  })

  it('button is disabled when isSupported=false', () => {
    resetMock({ isSupported: false })
    render(<FabMic onResult={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('button is disabled when disabled prop is true', () => {
    resetMock()
    render(<FabMic onResult={vi.fn()} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('aria-pressed=false when not listening', () => {
    resetMock({ listening: false })
    render(<FabMic onResult={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('aria-pressed=true when listening', () => {
    resetMock({ listening: true })
    render(<FabMic onResult={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('label says "Stop dictation and insert text" when listening', () => {
    resetMock({ listening: true })
    render(<FabMic onResult={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: /stop dictation/i }),
    ).toBeInTheDocument()
  })

  it('calls start() when clicked while not listening', async () => {
    const start = vi.fn()
    resetMock({ start })
    render(<FabMic onResult={vi.fn()} />)
    await userEvent.click(screen.getByRole('button'))
    expect(start).toHaveBeenCalledOnce()
  })

  it('calls stop() when clicked while listening', async () => {
    const stop = vi.fn()
    resetMock({ listening: true, stop })
    render(<FabMic onResult={vi.fn()} />)
    await userEvent.click(screen.getByRole('button'))
    expect(stop).toHaveBeenCalledOnce()
  })

  it('shows error alert when error is set', () => {
    resetMock({ error: 'network' })
    render(<FabMic onResult={vi.fn()} />)
    expect(screen.getByRole('alert')).toHaveTextContent(/speech recognition error/i)
  })

  it('has no axe violations (supported, idle)', async () => {
    resetMock()
    const { container } = render(<FabMic onResult={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (unsupported)', async () => {
    resetMock({ isSupported: false })
    const { container } = render(<FabMic onResult={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
