import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import ReadMDX from './ReadMDX.mjs';

// https://astro.build/config
export default defineConfig({
  base: '/animare',
  outDir: './docs',
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [react(), mdx({ remarkPlugins: [ReadMDX, remarkGfm] })],
});
