import pluginJs from '@eslint/js';
import markdown from '@eslint/markdown';
import compat from 'eslint-plugin-compat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['lib/', 'docs/', 'scripts/', 'eslint.config.mjs'], 'main'),

  // prettier
  {
    files: ['**/*.md', 'src/**/*.ts'],
    extends: [eslintPluginPrettierRecommended],
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  // TypeScript
  {
    files: ['src/**/*.ts'],
    extends: [
      pluginJs.configs.recommended,
      tsEslint.configs.recommendedTypeChecked,
      eslintPluginUnicorn.configs.recommended,
      compat.configs['flat/recommended'],
    ],

    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      'object-shorthand': 'warn',
      'require-await': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-return': 'warn',
      'no-useless-call': 'warn',
      'no-unused-expressions': 'warn',
      'no-prototype-builtins': 'off',

      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/no-this-outside-of-class': 'off',
      'unicorn/prefer-https': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/consistent-class-member-order': 'off',
      'unicorn/prefer-await': 'off',
      'unicorn/no-collection-bracket-access': 'off',
      'unicorn/prefer-minimal-ternary': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
      'unicorn/no-useless-recursion': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/no-top-level-side-effects': 'off',
      'unicorn/no-non-function-verb-prefix': 'off',
      'unicorn/prefer-object-iterable-methods': 'off',
      'unicorn/prefer-smaller-scope': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/no-useless-coercion': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/prefer-includes-over-repeated-comparisons': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/single-line-block-comment-style': 'off', // conflicts with prettier-plugin-jsdoc
    },
  },

  // React and Preact hooks
  {
    files: ['src/react/**/*.ts', 'src/preact/**/*.ts'],
    extends: [reactHooks.configs.flat['recommended-latest']],
  },

  // Markdown
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    rules: {
      'markdown/no-html': 'off',
    },
  }
);
