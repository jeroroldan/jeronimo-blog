import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const posts = await getCollection('blog');
    
    const searchData = posts.map(post => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      href: `/blog/${post.id}/`,
      pubDate: post.data.pubDate.toISOString(),
      code: post.data.code || ''
    }));

    return new Response(JSON.stringify(searchData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error loading posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
