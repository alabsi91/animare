import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://alabsi91.github.io/animare',
  // base: 'animare',
  integrations: [
    starlight({
      title: 'animare',
      logo: {
        src: './src/assets/logo.svg',
      },
      editLink: {
        baseUrl: 'https://alabsi91.github.io/animare/',
      },
      customCss: ['./src/styles/custom.css', './src/fonts/font-face.css'],
      components: {
        ThemeSelect: './src/components/ThemeSelect.astro',
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
      sidebar: [
        { label: 'Installation', link: './installation' },
        { label: 'Usage', link: './usage' },
        {
          label: 'API',
          items: [
            {
              label: 'animare',
              items: [
                { label: 'Timeline', link: './api/animare/timeline' },
                { label: 'Group', link: './api/animare/group' },
                { label: 'Single', link: './api/animare/single' },
                { label: 'Loop', link: './api/animare/loop' },
              ],
            },
            {
              label: 'Plugins',
              items: [
                { label: 'Ease', link: './api/plugins/ease' },
                { label: 'AutoPause', link: './api/plugins/autopause' },
                { label: 'ScrollAnimation', link: './api/plugins/scrollanimation' },
                { label: 'Lerp', link: './api/plugins/lerp' },
                { label: 'VectorToColor', link: './api/plugins/vectortocolor' },
              ],
            },
            {
              label: 'React',
              items: [
                { label: 'useAnimare', link: './api/react/useanimare' },
                { label: 'useLoop', link: './api/react/useloop' },
                { label: 'useAutoPause', link: './api/react/useautopause' },
                { label: 'useScrollAnimation', link: './api/react/usescrollanimation' },
              ],
            },
            {
              label: 'Objects',
              items: [
                { label: 'AnimationOptions', link: './api/objects/animationoptions' },
                { label: 'TimelineOptions', link: './api/objects/timelineoptions' },
                { label: 'AnimationInfo', link: './api/objects/animationinfo' },
                { label: 'TimelineInfo', link: './api/objects/timelineinfo' },
                { label: 'TimelineReturnObject', link: './api/objects/timelineobject' },
              ],
            },
            {
              label: 'Enums',
              items: [
                { label: 'AnimationTiming', link: './api/enums/animationtiming' },
                { label: 'Direction', link: './api/enums/direction' },
                { label: 'Event', link: './api/enums/event' },
                { label: 'ScrollElementEdge', link: './api/enums/scrollelementedge' },
                { label: 'ScrollAxis', link: './api/enums/scrollaxis' },
              ],
            },
          ],
        },
      ],
    }),
    react(),
  ],
});
