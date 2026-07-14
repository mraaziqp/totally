import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';
import { verifyStoreAccess, verifyMasterAccess } from '../_lib/auth';

async function authorize(storeSlug: string, providedPassword?: string) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) return { store: null, authorized: false };
  const authorized = verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword);
  return { store, authorized };
}

function clampRating(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const adminPassword = req.headers['x-admin-password'];
  const providedPassword = typeof adminPassword === 'string' ? adminPassword : undefined;

  try {
    if (req.method === 'POST') {
      const { storeSlug, authorName, authorRole, quote, rating, avatarUrl, isPublished, displayOrder } = req.body;
      if (!storeSlug || typeof storeSlug !== 'string') {
        return res.status(400).json({ error: 'storeSlug is required' });
      }
      if (!authorName || typeof authorName !== 'string') {
        return res.status(400).json({ error: 'authorName is required' });
      }
      if (!quote || typeof quote !== 'string') {
        return res.status(400).json({ error: 'quote is required' });
      }

      const { store, authorized } = await authorize(storeSlug, providedPassword);
      if (!store || !authorized) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const testimonial = await prisma.testimonial.create({
        data: {
          storeId: store.id,
          authorName,
          authorRole: authorRole || null,
          quote,
          rating: clampRating(rating),
          avatarUrl: avatarUrl || null,
          isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
          displayOrder: Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : 0,
        },
      });
      return res.status(201).json(testimonial);
    }

    if (req.method === 'PATCH') {
      const { id, storeSlug, authorName, authorRole, quote, rating, avatarUrl, isPublished, displayOrder } = req.body;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'id is required' });
      }
      if (!storeSlug || typeof storeSlug !== 'string') {
        return res.status(400).json({ error: 'storeSlug is required' });
      }

      const { store, authorized } = await authorize(storeSlug, providedPassword);
      if (!store || !authorized) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (!existing || existing.storeId !== store.id) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }

      const updateData: Record<string, unknown> = {};
      if (authorName !== undefined) updateData.authorName = authorName;
      if (authorRole !== undefined) updateData.authorRole = authorRole || null;
      if (quote !== undefined) updateData.quote = quote;
      if (rating !== undefined) updateData.rating = clampRating(rating);
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl || null;
      if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);
      if (displayOrder !== undefined) updateData.displayOrder = Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : 0;

      const testimonial = await prisma.testimonial.update({ where: { id }, data: updateData });
      return res.json(testimonial);
    }

    if (req.method === 'DELETE') {
      const { id, storeSlug } = req.body;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'id is required' });
      }
      if (!storeSlug || typeof storeSlug !== 'string') {
        return res.status(400).json({ error: 'storeSlug is required' });
      }

      const { store, authorized } = await authorize(storeSlug, providedPassword);
      if (!store || !authorized) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (!existing || existing.storeId !== store.id) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }

      await prisma.testimonial.delete({ where: { id } });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error managing testimonial:', error);
    return res.status(500).json({ error: 'Failed to manage testimonial' });
  }
}
