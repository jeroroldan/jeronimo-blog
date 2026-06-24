// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { unified } from '@astrojs/markdown-remark';
import { defineConfig, logHandlers } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport',
	},
	markdown: {
		processor: unified(),
	},
	logger: logHandlers.compose(
		logHandlers.console(),
		logHandlers.json(),
	),
	integrations: [
		expressiveCode(),
		mdx(),
		sitemap()
	]
});
