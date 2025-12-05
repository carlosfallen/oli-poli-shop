import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { DB } = locals.runtime.env;
    const { results } = await DB.prepare(
      'SELECT key, value FROM settings'
    ).all();

    const settings: Record<string, string> = {};
    results.forEach((row: any) => {
      settings[row.key] = row.value;
    });

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), {
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

    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(body)) {
      await DB.prepare(
        `INSERT INTO settings (key, value, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?`
      ).bind(key, value, now, value, now).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update settings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
