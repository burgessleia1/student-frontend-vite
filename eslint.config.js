// .eslintrc.ts
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  root: true,
  ignores: ['dist', 'node_modules'],
  parser: tsParser,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['react-hooks', 'react-refresh', '@typescript-eslint'],
  extends: [
    js.configs.recommended,
    tsPlugin.configs.recommended,
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended',
  ],
  rules: {
    // Add project-specific overrides here
  },
});

