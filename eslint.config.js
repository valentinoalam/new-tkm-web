import { fixupPluginRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
// import eslintPluginImport from 'eslint-plugin-import';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/essential'],
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        parser: tseslint.parser,
      },
    },
    rules: {
      'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-unused-vars': ['error'],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'vue/multi-word-component-names': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
    plugins: {
      vue: eslintPluginVue,
      prettier: eslintPluginPrettier, // Add Prettier plugin
      'simple-import-sort': simpleImportSort,
      import: fixupPluginRules(importPlugin),
      'unused-imports': eslintPluginUnusedImports,
    },
  },
];
