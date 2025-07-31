// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tailwind from 'eslint-plugin-tailwindcss'

export default tseslint.config(
  { ignores: ['dist', 'build', 'coverage', '.vite'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // <-- Этот пресет уже подключает plugin "react-hooks"
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },

    // ВАЖНО: не объявляем 'react-hooks' здесь повторно
    plugins: {
      react,
      tailwindcss: tailwind,
    },

    settings: {
      react: { version: 'detect' },
      tailwindcss: {
        callees: ['clsx', 'ctl', 'classnames'],
        removeDuplicates: true,
        // config: 'tailwind.config.ts',
      },
    },

    rules: {
      // React
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],

      // НЕ дублируем: ...reactHooks.configs.recommended.rules

      // TypeScript
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Общие
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prefer-const': 'warn',

      // Tailwind
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
    },
  },

  // Блок для тестов
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.vitest, ...globals.jest },
    },
    rules: { 'no-console': 'off' },
  },
)
