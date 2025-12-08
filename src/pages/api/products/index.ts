import type { APIRoute } from 'astro';
import { slugify } from '../../../lib/utils';

export const GET: APIRoute = async ({ locals }) => {
  console.log('API GET /api/products: Request received');
  console.log('API GET /api/products: locals:', locals);
  console.log('API GET /api/products: runtime:', locals?.runtime);
  
  try {
    if (!locals?.runtime?.env?.DB) {
      console.error('API GET /api/products: DB not available');
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { DB } = locals.runtime.env;
    console.log('API GET /api/products: DB accessed, querying...');
    
    const { results } = await DB.prepare(
      'SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC'
    ).all();
    
    console.log('API GET /api/products: Query results:', results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API GET /api/products: Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('API POST /api/products: Request received');
  try {
    const { DB } = locals.runtime.env;
    const body = await request.json() as any;
    console.log('API POST /api/products: Body:', body);
    
    const { name, category, description, price, image_url, stock, featured } = body;
    const id = slugify(name);
    const now = new Date().toISOString();

    await DB.prepare(
      `INSERT INTO products (id, name, category, description, price, image_url, stock, featured, active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).bind(id, name, category, description, price, image_url, stock || 0, featured || 0, now, now).run();

    console.log('API POST /api/products: Product created:', id);
    return new Response(JSON.stringify({ id, success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API POST /api/products: Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};