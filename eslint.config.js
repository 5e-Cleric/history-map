import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist'],  // Ignore build/dist directories
  },
  {
    files: ['**/*.{js,jsx}'], // Apply these rules to JS/JSX files
    languageOptions: {
      ecmaVersion: 'latest',   // Modern ECMAScript version
      sourceType: 'module',    // Use ECMAScript modules
      ecmaFeatures: { jsx: true }, // Enable JSX
      globals: {
        ...globals.browser, // Browser globals (window, document, etc.)
        ...globals.node,    // Node.js globals (process, __dirname, etc.)
      },
    },
    settings: {
      react: {
        version: '18.3',  // React version for linting purposes
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,           // Base JS rules
      ...react.configs.recommended.rules,        // Recommended React rules
      ...react.configs['jsx-runtime'].rules,     // React 17+ JSX transform rules
      ...reactHooks.configs.recommended.rules,   // React Hooks rules
      'react/jsx-no-target-blank': 'off',        // Disable warning for 'target="_blank"'
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
