// eslint.config.js - ESLint 9 Flat Config
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
    // Global ignores configuration - these patterns are ignored for ALL config objects
    {
        ignores: ['**/node_modules/**', '**/dist/**', '**/_ssr-dist/**', '**/build/**', '**/.git/**'],
    },

    // Global ESLint configuration
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // Base configuration - eslint:recommended equivalent
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        rules: {
            'no-const-assign': 'error',
            'no-dupe-else-if': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-ex-assign': 'error',
            'no-extra-boolean-cast': 'error',
            'no-fallthrough': 'error',
            'no-func-assign': 'error',
            'no-import-assign': 'error',
            'no-obj-calls': 'error',
            'no-prototype-builtins': 'error',
            'no-self-assign': 'error',
            'no-unreachable': 'error',
            'no-unsafe-negation': 'error',
            'no-unsafe-optional-chaining': 'error',
            'use-isnan': 'error',
            'valid-typeof': 'error',
        },
    },

    // React configuration
    {
        files: ['**/*.{jsx,tsx,js,ts}'],
        plugins: {
            react: reactPlugin,
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactJsxRuntime.rules,
            ...jsxA11y.configs.recommended.rules,
            'react/display-name': 'off',
        },
    },

    // TypeScript configuration
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            '@typescript-eslint/no-non-null-assertion': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },

    // Custom rules for all files
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        rules: {
            quotes: ['warn', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'max-len': [1, { code: 150, ignoreComments: true, ignoreStrings: true }],
            indent: 'off',
        },
    },
];
