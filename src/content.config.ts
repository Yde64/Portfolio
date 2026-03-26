import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    featured: z.boolean(),
    order: z.number(),
  }),
});

export const collections = { projects };
