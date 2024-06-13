// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  arrowParens: 'avoid',
  printWidth: 130,
  jsxSingleQuote: true,
  quoteProps: 'consistent',
  semi: true,
  bracketSpacing: true,
  bracketSameLine: false,
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        singleQuote: true,
        arrowParens: 'avoid',
        printWidth: 130,
        jsxSingleQuote: true,
        quoteProps: 'consistent',
        semi: true,
        bracketSpacing: true,
        bracketSameLine: false,
        endOfLine: 'auto',
      },
    },
  ],
};
