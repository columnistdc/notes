import configPrettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tailwind from 'eslint-plugin-tailwindcss'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import js from '@eslint/js'

export default tseslint.config(
  { ignores: ['dist', 'build', 'coverage', '.vite'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

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

    plugins: {
      react,
      tailwindcss: tailwind,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },

    settings: {
      react: { version: 'detect' },
      tailwindcss: {
        callees: ['clsx', 'ctl', 'classnames'],
        removeDuplicates: true,
      },
    },

    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1) Сайд-эффекты (должны быть первыми): import 'polyfills'
            ['^\\u0000'],

            // 2) Пакеты: react → остальные npm-пакеты (включая node builtins/префикс node:)
            ['^react', '^(node:)?\\w', '^@?\\w'],

            // 3) Импорты проекта по алиасам
            //  - '@/…' (часто в Vite/TS), 'src/…' — если импортируете из src без относительных путей
            ['^@/(.*)$', '^src/(.*)$'],

            // 4) Родительские относительные (.. сначала), затем соседние (.)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

            // 5) Импорты стилей (css/scss/pcss и т.п.) — всегда в самом конце
            ['^.+\\.s?css$'],
          ],
        },
      ],
    },
  },
  configPrettier,
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.vitest, ...globals.jest },
    },
    rules: { 'no-console': 'off' },
  },
)
