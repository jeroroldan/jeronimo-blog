// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [
		expressiveCode({
			langs: ['gradle', 'bash', 'powershell', 'json', 'typescript', 'javascript', 'markdown', 'redis', 'env', 'caddy', 'dns', 'figma', 'gitignore']
		}),
		mdx(),
		sitemap()
	]
});
