import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist/', '.astro/'] },

  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  prettier,

  {
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    files: ['**/*.astro/*.js', '**/*.astro/*.ts'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
);
