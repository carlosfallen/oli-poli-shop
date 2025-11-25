// FILE: src/services/cloudflareUpload.ts
const CLOUDFLARE_WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL;

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Falha ao fazer upload da imagem');
  }

  const data = await response.json();
  return data.url;
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  const filename = imageUrl.split('/').pop();
  
  await fetch(`${CLOUDFLARE_WORKER_URL}/delete/${filename}`, {
    method: 'DELETE',
  });
};