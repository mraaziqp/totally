const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
// Vercel Node.js Functions cap request bodies at ~4.5MB; base64 inflates a
// file by ~33%, so the raw file limit must stay well under that ceiling.
const MAX_BYTES = 3 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Uploads an image file to the store's media storage and returns its public URL. */
export async function uploadImage(file: File, storeSlug: string, password: string, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Unsupported image type. Please use JPG, PNG, WEBP, or GIF.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image is too large. Please keep uploads under 3MB.');
  }

  const dataBase64 = await fileToBase64(file);

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
    body: JSON.stringify({ storeSlug, fileType: file.type, dataBase64, folder }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload image');
  }
  return data.url as string;
}
