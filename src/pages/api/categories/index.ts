import type { APIRoute } from 'astro';
import { slugify } from '../../../lib/utils';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { results } = await DB.prepare(
      'SELECT * FROM categories ORDER BY name ASC'
    ).all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const body = await request.json() as any;
    const { name, description, icon } = body;

    const id = slugify(name);
    const now = new Date().toISOString();

    await DB.prepare(
      `INSERT INTO categories (id, name, description, icon, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(id, name, description, icon, now, now).run();

    return new Response(JSON.stringify({ id, success: true }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create category' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
