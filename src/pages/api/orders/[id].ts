import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { id } = params;

    const order = await DB.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).bind(id).first();

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({
      ...order,
      items: JSON.parse(order.items as string),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch order' }), {
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
    const { status, delivery_date, observations } = body;

    const now = new Date().toISOString();

    await DB.prepare(
      `UPDATE orders
       SET status = ?, delivery_date = ?, observations = ?, updated_at = ?
       WHERE id = ?`
    ).bind(status, delivery_date || null, observations || null, now, id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update order' }), {
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

    await DB.prepare('DELETE FROM orders WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
