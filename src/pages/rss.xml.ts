import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
    const blogs = await getCollection('blogs');
    const sortedPosts = blogs.sort(
        (a, b) => Number(new Date(b.data.date)) - Number(new Date(a.data.date))
    );
    return rss({
        title: 'manosriram:blog',
        description:
            'My internet home',
        site: context.site || 'https://manosriram.com',
        items: sortedPosts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.description,
            link: `/blog/${post.slug}/`,
        })),
        customData: `<language>en-us</language>`,
    });
}
