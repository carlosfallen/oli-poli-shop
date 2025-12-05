import type { APIRoute } from 'astro';
import { slugify } from '../../../lib/utils';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { results } = await DB.prepare(
      'SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
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
    const body = await request.json();
    const { name, category, description, price, image_url, stock, featured } = body;

    const id = slugify(name);
    const now = new Date().toISOString();

    await DB.prepare(
      `INSERT INTO products (id, name, category, description, price, image_url, stock, featured, active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).bind(id, name, category, description, price, image_url, stock || 0, featured || 0, now, now).run();

    return new Response(JSON.stringify({ id, success: true }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
