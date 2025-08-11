import { describe, expect, it } from 'vitest'

import { createTextPreview } from '../createTextPreview'

describe('createTextPreview', () => {
  it('should return empty string for empty input', () => {
    expect(createTextPreview('')).toBe('')
  })

  it('should return empty string for whitespace only input', () => {
    expect(createTextPreview('   ')).toBe('')
    expect(createTextPreview('\t\n\r')).toBe('')
    expect(createTextPreview('  \n  \t  ')).toBe('')
  })

  it('should normalize multiple whitespace characters to single space', () => {
    expect(createTextPreview('hello   world')).toBe('hello world')
    expect(createTextPreview('hello\tworld')).toBe('hello world')
    expect(createTextPreview('hello\nworld')).toBe('hello world')
    expect(createTextPreview('hello\r\nworld')).toBe('hello world')
    expect(createTextPreview('hello  \t  \n  world')).toBe('hello world')
  })

  it('should trim leading and trailing whitespace', () => {
    expect(createTextPreview('  hello world  ')).toBe('hello world')
    expect(createTextPreview('\nhello world\n')).toBe('hello world')
    expect(createTextPreview('\t hello world \t')).toBe('hello world')
  })

  it('should return text unchanged if length is 140 characters or less', () => {
    const shortText = 'This is a short text that should not be truncated'
    expect(createTextPreview(shortText)).toBe(shortText)

    const exactly140Chars = 'a'.repeat(140)
    expect(createTextPreview(exactly140Chars)).toBe(exactly140Chars)
  })

  it('should truncate text to 140 characters and add ellipsis if longer', () => {
    const longText =
      'This is a very long text that exceeds the maximum allowed length and should be truncated to exactly 140 characters with an ellipsis at the end'
    const result = createTextPreview(longText)

    expect(result.length).toBe(141)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe(longText.slice(0, 140).trimEnd() + '…')
  })

  it('should handle text with exactly 141 characters', () => {
    const text141 = 'a'.repeat(141)
    const result = createTextPreview(text141)

    expect(result.length).toBe(141)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe('a'.repeat(140) + '…')
  })

  it('should handle text with exactly 142 characters', () => {
    const text142 = 'a'.repeat(142)
    const result = createTextPreview(text142)

    expect(result.length).toBe(141)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe('a'.repeat(140) + '…')
  })

  it('should preserve single spaces between words after normalization', () => {
    expect(createTextPreview('word1 word2  word3')).toBe('word1 word2 word3')
    expect(createTextPreview('word1\tword2\nword3')).toBe('word1 word2 word3')
  })

  it('should handle text with only whitespace characters that results in empty string', () => {
    expect(createTextPreview(' \t \n \r ')).toBe('')
  })

  it('should handle text that becomes empty after normalization', () => {
    expect(createTextPreview('   \t\n\r   ')).toBe('')
  })

  it('should handle unicode characters correctly', () => {
    const unicodeText = 'Привет мир! 🌍 Hello world!'
    expect(createTextPreview(unicodeText)).toBe(unicodeText)

    const longUnicodeText = 'Привет мир! 🌍 Hello world! '.repeat(20)
    const result = createTextPreview(longUnicodeText)
    expect(result.length).toBe(140)
    expect(result.endsWith('…')).toBe(true)
  })

  it('should handle text with mixed whitespace and content', () => {
    const mixedText = '  hello  \t  world  \n  test  '
    expect(createTextPreview(mixedText)).toBe('hello world test')
  })
})
