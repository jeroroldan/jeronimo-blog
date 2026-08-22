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
	vite: {
		server: {
			// Reduce dev-server module-runner load that triggers the
			// "transport invoke timed out" CSS error on Windows.
			preTransformRequests: false,
		},
		build: {
			rollupOptions: {
				// This can help with memory usage on Windows
				maxMemoryLimit: '1.5G',
			},
		},
	},
	integrations: [
		expressiveCode({
			shiki: {
				langAlias: {
					gradle: 'groovy',
					env: 'ini',
					caddy: 'hcl',
					m: 'objc',
					gitignore: 'ini',
					figma: 'text',
					txt: 'text',
				},
				langs: [
					{
						displayName: 'Plain Text',
						name: 'text',
						scopeName: 'source.text',
						patterns: [{ match: '.*' }],
					},
				],
			},
		}),
		mdx(),
		sitemap()
	]
});