import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'

import { configureAxe, toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

expect.extend(toHaveNoViolations)

configureAxe({
  rules: {
    // colour-contrast requires a real rendering environment (jsdom has no layout engine)
    'color-contrast': { enabled: false },
  },
})
