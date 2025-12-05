import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { R2 } = locals.runtime.env;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    // Upload to R2
    await R2.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Return public URL (you'll need to configure R2 public access or use a custom domain)
    const url = `/images/${filename}`;

    return new Response(JSON.stringify({ url, success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
