import { defineCollection, z } from 'astro:content';

const blogsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        image: z.string(),
    }),
});

export const collections = {
    blogs: blogsCollection,
};
