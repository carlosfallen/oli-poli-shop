import type { APIRoute } from 'astro';
import { generateOrderId } from '../../../lib/utils';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { results } = await DB.prepare(
      'SELECT * FROM orders ORDER BY created_at DESC'
    ).all();

    // Parse items JSON
    const orders = results.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
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
    const { name, phone, address, items, total, delivery_date, observations } = body;

    const id = generateOrderId();
    const now = new Date().toISOString();

    await DB.prepare(
      `INSERT INTO orders (id, name, phone, address, items, total, status, delivery_date, observations, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`
    ).bind(id, name, phone, address, JSON.stringify(items), total, delivery_date || null, observations || null, now, now).run();

    return new Response(JSON.stringify({ id, success: true }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
