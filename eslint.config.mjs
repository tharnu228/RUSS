import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import reactRefresh from 'eslint-plugin-react-refresh';
import ulbiTvPlugin from 'eslint-plugin-ulbi-tv-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginImport from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['*', '!src'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
      'plugin:storybook/recommended',
      'plugin:react/recommended',
    ),
  ),
  {
    plugins: {
      'react-refresh': reactRefresh,
      'react-hooks': fixupPluginRules(reactHooks),
      'ulbi-tv-plugin': ulbiTvPlugin,
      'eslint-plugin-import': eslintPluginImport,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        __IS_DEV__: true,
      },

      parser: tsParser,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      'react-hooks/rules-of-hooks': 'error',

      'react/jsx-max-props-per-line': [
        'warn',
        {
          maximum: 6,
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react/button-has-type': 'error',
      'react/prop-types': 'error',
      'react/require-default-props': 'warn',
      camelcase: ['warn', { properties: 'always' }],
      'capitalized-comments': ['warn', 'always'],
      eqeqeq: ['warn', 'smart'],
      'func-names': ['warn', 'as-needed'],
      'func-style': ['warn', 'expression'],
      'no-var': 'error',
      'prefer-const': 'warn',
      'require-await': 'warn',
      'react/no-array-index-key': 'error',
      'react/display-name': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/jsx-no-bind': 'error',
      'ulbi-tv-plugin/path-checker': [
        'error',
        {
          alias: '@',
        },
      ],
      'ulbi-tv-plugin/layer-imports': [
        'error',
        {
          alias: '@',
          ignoreImportPatterns: ['@/app/store/**'],
        },
      ],
      'ulbi-tv-plugin/public-api-imports': [
        'error',
        {
          alias: '@',
          testFilesPatterns: [
            '**/*.test.*',
            '**/*.story.*',
            '**/StoreDecorator.tsx',
          ],
        },
      ],

      'react/prop-types': [0],
      'react/require-default-props': [0],
      'react/jsx-no-bind': [0],
      'react/no-array-index-key': [1],
    },
  },
];
