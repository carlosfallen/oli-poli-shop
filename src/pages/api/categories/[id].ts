import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { id } = params;

    const category = await DB.prepare(
      'SELECT * FROM categories WHERE id = ?'
    ).bind(id).first();

    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(category), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch category' }), {
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
    const body = await request.json();
    const { name, description, icon } = body;

    const now = new Date().toISOString();

    await DB.prepare(
      `UPDATE categories
       SET name = ?, description = ?, icon = ?, updated_at = ?
       WHERE id = ?`
    ).bind(name, description, icon, now, id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update category' }), {
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

    await DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete category' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
