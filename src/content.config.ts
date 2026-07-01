import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const UpdateSchema = z.object({
	title: z.string(),
	tag: z.string().optional(),
	summary: z.string(),
	date: z.coerce.date(),
	draft: z.boolean().default(false),
});

const updates = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/content/updates" }),
	schema: UpdateSchema,
});

const restrictedUpdates = defineCollection({
	loader: glob({
		pattern: "**/*.mdx",
		base: "./content/privates/updates",
	}),
	schema: UpdateSchema,
});

const works = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/content/works" }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		client: z.string(),
		role: z.string(),
		year: z.coerce.number(),
		techstack: z.array(z.string()),
		link: z.string().optional(),
		challenge: z.string(),
		solution: z.string(),
		thumbnail: z.string(),
	}),
});

const snippets = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/content/snippets" }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		language: z.string(),
		tags: z.array(z.string()),
	}),
});

export const collections = { updates, restrictedUpdates, works, snippets };
