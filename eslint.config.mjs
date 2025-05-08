import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': 'warn',
      'max-classes-per-file': 'off',
      'no-underscore-dangle': ['error', { allow: ['__brand'] }],
      'no-debugger': 'error',
      'no-unused-expressions': 'error',
      'no-param-reassign': 'error',
      'no-mixed-operators': 'off',
      'no-plusplus': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'error',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  }),
]

export default eslintConfig
