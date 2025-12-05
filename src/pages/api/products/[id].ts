import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { id } = params;

    const product = await DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { id } = params;
    const body = await request.json() as any;
    const { name, category, description, price, image_url, stock, featured, active } = body;

    const now = new Date().toISOString();

    await DB.prepare(
      `UPDATE products
       SET name = ?, category = ?, description = ?, price = ?, image_url = ?, stock = ?, featured = ?, active = ?, updated_at = ?
       WHERE id = ?`
    ).bind(name, category, description, price, image_url, stock, featured, active, now, id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update product' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { id } = params;

    await DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
