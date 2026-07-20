import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, MEDIA_BUCKET } from './_lib/supabase.js';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
};

// Keep raw file well under Vercel's 4.5 MB body limit (base64 inflates ~33%)
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS pre-flight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storeSlug, fileType, dataBase64 } = req.body;

    if (!storeSlug || typeof storeSlug !== 'string') {
      return res.status(400).json({ error: 'storeSlug is required' });
    }
    if (!fileType || !ALLOWED_TYPES[fileType]) {
      return res.status(400).json({ error: 'Unsupported image type. Use JPG, PNG, WEBP, or GIF.' });
    }
    if (!dataBase64 || typeof dataBase64 !== 'string') {
      return res.status(400).json({ error: 'No file data received' });
    }

    const buffer = Buffer.from(dataBase64, 'base64');
    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: 'Image is too large. Please keep uploads under 3MB.' });
    }

    const ext = ALLOWED_TYPES[fileType];
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `leads/${storeSlug}/${safeName}`;

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (e) {
      console.error('Supabase admin client error:', e);
      return res.status(503).json({ error: (e as Error).message });
    }

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, buffer, { contentType: fileType, upsert: false });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(502).json({
        error: `Storage upload failed: ${uploadError.message}`,
      });
    }

    const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return res.status(201).json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Error uploading lead image:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
