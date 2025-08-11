import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatTimestamp } from '../formatTimestamp'

const TIME_EN_US = /^\d{2}:\d{2}\s(AM|PM)$/

describe('formatTimestamp', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('when now = 2025-03-10 15:45 (local time)', () => {
    const NOW = new Date(2025, 2, 10, 15, 45, 0, 0) // месяц 0-based: 2 => March

    beforeEach(() => {
      vi.setSystemTime(NOW)
    })

    it('returns time (HH:MM AM/PM) for a timestamp from the same day', () => {
      const ts = new Date(2025, 2, 10, 9, 30).getTime() // 09:30 same day
      const out = formatTimestamp(ts)
      expect(out).toMatch(TIME_EN_US)
    })

    it('returns "12:00 AM" exactly at the start of the same day (midnight)', () => {
      const ts = new Date(2025, 2, 10, 0, 0, 0).getTime()
      const out = formatTimestamp(ts)
      expect(out).toBe('12:00 AM')
    })

    it('returns date "Mar 9, 2025" for a timestamp from the previous day', () => {
      const ts = new Date(2025, 2, 9, 23, 59, 0).getTime()
      const out = formatTimestamp(ts)
      expect(out).toBe('Mar 9, 2025')
    })

    it('returns date for a different month in the same year', () => {
      const ts = new Date(2025, 11, 25, 8, 0, 0).getTime() // Dec 25, 2025
      const out = formatTimestamp(ts)
      expect(out).toBe('Dec 25, 2025')
    })

    it('returns date for a different year', () => {
      const ts = new Date(2024, 11, 31, 23, 59, 0).getTime() // Dec 31, 2024
      const out = formatTimestamp(ts)
      expect(out).toBe('Dec 31, 2024')
    })
  })

  describe('midnight boundary near now', () => {
    const NOW = new Date(2025, 2, 10, 0, 5, 0, 0)

    beforeEach(() => {
      vi.setSystemTime(NOW)
    })

    it('for 00:00 today returns time', () => {
      const ts = new Date(2025, 2, 10, 0, 0, 0).getTime()
      const out = formatTimestamp(ts)
      expect(out).toMatch(TIME_EN_US)
    })

    it('for 23:59 yesterday returns date', () => {
      const ts = new Date(2025, 2, 9, 23, 59, 0).getTime()
      const out = formatTimestamp(ts)
      expect(out).toBe('Mar 9, 2025')
    })
  })

  describe('invalid input', () => {
    it('logs error and returns empty string for NaN timestamp', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = formatTimestamp(Number.NaN)

      expect(result).toBe('')
      expect(spy).toHaveBeenCalledWith('Invalid timestamp passed to formatTimestamp:', Number.NaN)

      spy.mockRestore()
    })
  })
})
