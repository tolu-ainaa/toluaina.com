// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toluaina.com',
  // Static output: every route is a plain HTML file, so /xr and /motion work as deep links on any host.
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
});
