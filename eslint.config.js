import configPrettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import js from '@eslint/js'

export default tseslint.config(
  { ignores: ['dist', 'build', 'coverage', '.vite', '.husky'] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,

  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
          defaultProject: './tsconfig.app.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },

    plugins: {
      react,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      'jsx-a11y': jsxA11y,
    },

    settings: {
      react: { version: 'detect' },
    },

    rules: {
      ...jsxA11y.configs.recommended.rules,

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^react', '^(node:)?\\w', '^@?\\w'],
            ['^@/(.*)$', '^src/(.*)$'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.s?css$'],
          ],
        },
      ],
    },
  },

  // Disable type-aware unsafe rules for the ESLint config file itself,
  // since third-party plugin objects are not fully typed.
  {
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // tseslint.config() helper carries a @deprecated tag pointing to ESLint's
      // defineConfig, but remains the documented typescript-eslint entry point.
      '@typescript-eslint/no-deprecated': 'off',
    },
  },

  // Routes file exports a router object, not components — fast-refresh rule doesn't apply
  {
    files: ['src/routes/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  configPrettier,
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/*.dom.test.{ts,tsx}', '**/*.component.test.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.vitest, ...globals.jest },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
)
