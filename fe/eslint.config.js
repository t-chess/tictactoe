import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**/*', 'android/**/*', 'ios/**/*'],
  },
  eslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      import: importPlugin,
      'react-hooks': fixupPluginRules(reactHooks),
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
      perfectionist,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      'import/no-duplicates': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enum',
          format: ['PascalCase'],
          custom: {
            regex: 'Enum',
            match: false,
          },
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        {
          selector: ['interface', 'typeAlias'],
          format: ['PascalCase'],
          custom: {
            regex: '^[IT][A-Z]|[IT]$',
            match: false,
          },
        },
      ],
      // Note: you must disable the base rule as it can report incorrect errors
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      semi: 'error',
      'no-console': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      'max-len': ['error', { code: 120 }],
      'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
      'perfectionist/sort-imports': [
        'error',
        {
          // type: 'natural',
          ignoreCase: true,
          newlinesBetween: 'never',
          groups: [
            'react',
            ['builtin', 'external'],
            ['internal', 'aliases'],
            'unknown',
            'parent',
            'sibling',
            'index',
            'object',
            'styles',
          ],
          customGroups: {
            value: {
              react: ['^react$'],
              aliases: ['^@(assets|components|const|hooks|pages|services|src|utils)/'],
              styles: ['../*.scss', './*.scss'],
            },
          },
        },
      ],
      // Note: you must disable the base rule as it can report incorrect errors
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
    },
    settings: {
      react: { version: '18.3' },
    },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.{js,jsx}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.{d.ts,ts,tsx}'],
    rules: {
      'no-undef': 'off',
      quotes: 'off',
    },
  },
);
