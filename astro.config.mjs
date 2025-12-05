import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    routes: {
      extend: {
        exclude: [{ pattern: '/api/*' }]
      }
    }
  }),
  integrations: [
    solidJs(),
    tailwind({
      applyBaseStyles: false,
    })
  ],
  vite: {
    ssr: {
      external: ['node:async_hooks']
    }
  }
});
