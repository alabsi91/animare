import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://alabsi91.github.io',
  base: 'animare',
  integrations: [
    starlight({
      title: 'animare',
      logo: {
        src: './src/assets/logo.svg',
      },
      favicon: './src/assets/logo.svg',
      customCss: ['./src/styles/custom.css', './src/fonts/font-face.css'],
      components: {
        ThemeSelect: './src/components/ThemeSelect.astro',
        SiteTitle: './src/components/Logo.astro',
        Head: './src/components/Head.astro',
      },
      expressiveCode: {
        styleOverrides: {
          borderColor: 'var(--code-border-color)',
          borderRadius: '0.5rem',
          codeBackground: 'var(--code-background)',
          frames: {
            editorActiveTabIndicatorBottomColor: 'var(--secondary)',
            editorTabBarBackground: 'var(--code-background)',
            editorActiveTabBackground: 'var(--code-background)',
            terminalBackground: 'var(--code-background)',
            terminalTitlebarBorderBottomColor: 'var(--code-background)',
            terminalTitlebarBackground: 'var(--code-background)',
            terminalTitlebarDotsForeground: 'var(--secondary)',
            terminalTitlebarDotsOpacity: 0.7,
          },
        },
        themes: ['dracula'],
      },
      social: {
        'github': 'https://github.com/alabsi91/animare',
        'x.com': 'https://x.com/alabsi91',
      },
    }),
    react(),
  ],
});
