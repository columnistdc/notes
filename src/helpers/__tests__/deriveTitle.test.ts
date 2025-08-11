/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest'

import { deriveTitle } from '../deriveTitle'

describe('deriveTitle', () => {
  it('should return empty string for empty input', () => {
    expect(deriveTitle('')).toBe('')
  })

  it('should return empty string for null input', () => {
    expect(deriveTitle(null as any)).toBe('')
  })

  it('should return empty string for undefined input', () => {
    expect(deriveTitle(undefined as any)).toBe('')
  })

  it('should return empty string for whitespace only input', () => {
    expect(deriveTitle('   ')).toBe('')
    expect(deriveTitle('\t\n\r')).toBe('')
    expect(deriveTitle('  \n  \t  ')).toBe('')
  })

  it('should return first non-empty line trimmed', () => {
    expect(deriveTitle('Hello World')).toBe('Hello World')
    expect(deriveTitle('  Hello World  ')).toBe('Hello World')
    expect(deriveTitle('\tHello World\t')).toBe('Hello World')
  })

  it('should skip empty lines and return first non-empty line', () => {
    expect(deriveTitle('\n\nHello World\n\n')).toBe('Hello World')
    expect(deriveTitle('\r\n\r\nHello World\r\n\r\n')).toBe('Hello World')
    expect(deriveTitle('  \n  \t  \n  Hello World  \n  \t  ')).toBe('Hello World')
  })

  it('should handle single line with default max length', () => {
    const shortText = 'This is a short title'
    expect(deriveTitle(shortText)).toBe(shortText)

    const exactly80Chars = 'a'.repeat(80)
    expect(deriveTitle(exactly80Chars)).toBe(exactly80Chars)
  })

  it('should truncate text longer than default max length (80)', () => {
    const longText = 'a'.repeat(100)
    const result = deriveTitle(longText)

    expect(result.length).toBe(80)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe(longText.slice(0, 79) + '…')
  })

  it('should handle custom max length', () => {
    const customMax = 50
    const longText = 'a'.repeat(100)
    const result = deriveTitle(longText, customMax)

    expect(result.length).toBe(customMax)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe(longText.slice(0, customMax - 1) + '…')
  })

  it('should handle custom max length of 1', () => {
    const result = deriveTitle('Hello World', 1)
    expect(result).toBe('…')
  })

  it('should handle custom max length of 0', () => {
    const result = deriveTitle('Hello World', 0)
    expect(result).toBe('')
  })

  it('should handle custom max length of negative value', () => {
    const result = deriveTitle('Hello World', -5)
    expect(result).toBe('')
  })

  it('should handle text with exactly max length + 1', () => {
    const text81 = 'a'.repeat(81)
    const result = deriveTitle(text81)

    expect(result.length).toBe(80)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe('a'.repeat(79) + '…')
  })

  it('should handle text with exactly max length + 2', () => {
    const text82 = 'a'.repeat(82)
    const result = deriveTitle(text82)

    expect(result.length).toBe(80)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe('a'.repeat(79) + '…')
  })

  it('should handle multiple lines with first line empty', () => {
    const multiLineText = '\n\nSecond line\nThird line'
    expect(deriveTitle(multiLineText)).toBe('Second line')
  })

  it('should handle multiple lines with first line whitespace only', () => {
    const multiLineText = '   \n\t\nSecond line\nThird line'
    expect(deriveTitle(multiLineText)).toBe('Second line')
  })

  it('should handle multiple lines with mixed content', () => {
    const multiLineText = 'First line\nSecond line\nThird line'
    expect(deriveTitle(multiLineText)).toBe('First line')
  })

  it('should handle multiple lines with first line exceeding max length', () => {
    const longFirstLine = 'a'.repeat(100)
    const multiLineText = `${longFirstLine}\nSecond line\nThird line`
    const result = deriveTitle(multiLineText)

    expect(result.length).toBe(80)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe(longFirstLine.slice(0, 79) + '…')
  })

  it('should handle multiple lines with second line as first non-empty', () => {
    const multiLineText = '\nSecond line\nThird line'
    expect(deriveTitle(multiLineText)).toBe('Second line')
  })

  it('should handle text with only empty lines', () => {
    expect(deriveTitle('\n\n\n')).toBe('')
    expect(deriveTitle('\r\n\r\n\r\n')).toBe('')
    expect(deriveTitle('  \n  \t  \n  ')).toBe('')
  })

  it('should handle text with mixed line endings', () => {
    const mixedEndings = 'Line 1\r\nLine 2\nLine 3\rLine 4'
    expect(deriveTitle(mixedEndings)).toBe('Line 1')
  })

  it('should handle unicode characters correctly', () => {
    const unicodeText = 'Привет мир! 🌍 Hello world!'
    expect(deriveTitle(unicodeText)).toBe(unicodeText)

    const longUnicodeText = 'Привет мир! 🌍 Hello world! '.repeat(10)
    const result = deriveTitle(longUnicodeText)
    expect(result.length).toBe(80)
    expect(result.endsWith('…')).toBe(true)
  })

  it('should handle text with special characters', () => {
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    expect(deriveTitle(specialChars)).toBe(specialChars)
  })

  it('should handle text with numbers', () => {
    const numbersText = '1234567890'
    expect(deriveTitle(numbersText)).toBe(numbersText)
  })

  it('should handle text with mixed content types', () => {
    const mixedContent = 'Hello 123 !@# World 🌍'
    expect(deriveTitle(mixedContent)).toBe(mixedContent)
  })

  it('should handle very long text with custom max length', () => {
    const customMax = 25
    const veryLongText = 'a'.repeat(100)
    const result = deriveTitle(veryLongText, customMax)

    expect(result.length).toBe(customMax)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toBe('a'.repeat(customMax - 1) + '…')
  })

  it('should handle text with only one character', () => {
    expect(deriveTitle('a')).toBe('a')
    expect(deriveTitle('1')).toBe('1')
    expect(deriveTitle('!')).toBe('!')
  })

  it('should handle text with only one character and custom max length 1', () => {
    expect(deriveTitle('a', 1)).toBe('a')
    expect(deriveTitle('1', 1)).toBe('1')
    expect(deriveTitle('!', 1)).toBe('!')
  })

  it('should handle text with only one character and custom max length 0', () => {
    expect(deriveTitle('a', 0)).toBe('')
    expect(deriveTitle('1', 0)).toBe('')
    expect(deriveTitle('!', 0)).toBe('')
  })
})
