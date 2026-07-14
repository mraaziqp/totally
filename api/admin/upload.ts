import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';
import { verifyStoreAccess, verifyMasterAccess } from '../_lib/auth';
import { getSupabaseAdmin, MEDIA_BUCKET } from '../_lib/supabase';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// Vercel Node.js Functions cap request bodies at ~4.5MB regardless of any
// in-code config — base64 inflates a file by ~33%, so keep the raw file
// limit well under that ceiling.
const MAX_BYTES = 3 * 1024 * 1024; // 3MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storeSlug, fileName, fileType, dataBase64, folder } = req.body;
    const providedPassword = req.headers['x-admin-password'] as string | undefined;

    if (!storeSlug || typeof storeSlug !== 'string') {
      return res.status(400).json({ error: 'storeSlug is required' });
    }
    if (!fileType || !ALLOWED_TYPES[fileType]) {
      return res.status(400).json({ error: 'Unsupported image type. Use JPG, PNG, WEBP, or GIF.' });
    }
    if (!dataBase64 || typeof dataBase64 !== 'string') {
      return res.status(400).json({ error: 'No file data received' });
    }

    const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
    if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const buffer = Buffer.from(dataBase64, 'base64');
    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: 'Image is too large. Please keep uploads under 3MB.' });
    }

    const ext = ALLOWED_TYPES[fileType];
    const safeFolder = (typeof folder === 'string' && /^[a-z0-9-]+$/i.test(folder)) ? folder : 'uploads';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${storeSlug}/${safeFolder}/${safeName}`;

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (e) {
      return res.status(503).json({ error: (e as Error).message });
    }

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, buffer, { contentType: fileType, upsert: false });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(502).json({
        error: `Image storage upload failed: ${uploadError.message}. Make sure a public bucket named "${MEDIA_BUCKET}" exists in your Supabase project.`,
      });
    }

    const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return res.status(201).json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
