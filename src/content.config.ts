import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			code: z.string().optional(),
			language: z.enum(['es', 'en']).default('es').optional(),
			category: z.string().optional(),
			tags: z.array(z.string()).optional(),
			// --- Nueva taxonomía canónica (7 tracks). Opcionales para compat con 592 posts legacy ---
			track: z.string().optional(),
			subtrack: z.string().optional(),
			type: z.enum(['guia', 'masterclass', 'tutorial', 'referencia']).default('guia').optional(),
			level: z.enum(['fundamento', 'intermedio', 'avanzado']).optional(),
			serie: z.string().optional(),
			ordenSerie: z.number().optional(),
			prerequisites: z.array(z.string()).optional(),
			featured: z.boolean().default(false).optional(),
			draft: z.boolean().default(false).optional(),
			difficulty: z.string().optional(),
			readingTime: z.number().optional(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };
