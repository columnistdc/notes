// Makes custom test matchers visible to the type-checker for all test files.
// (The runtime registration happens in vitest.setup.*.ts.)
import '@testing-library/jest-dom/vitest'

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void
  }
}
