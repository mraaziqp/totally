import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { verifyStoreAccess, verifyMasterAccess } from '../_lib/auth.js';

async function authorize(storeSlug: string, providedPassword?: string) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) return { store: null, authorized: false };
  const authorized = verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword);
  return { store, authorized };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const adminPassword = req.headers['x-admin-password'];
  const providedPassword = typeof adminPassword === 'string' ? adminPassword : undefined;

  try {
    if (req.method === 'POST') {
      const { storeSlug, name, description, price } = req.body;
      if (!storeSlug || typeof storeSlug !== 'string') {
        return res.status(400).json({ error: 'storeSlug is required' });
      }
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'name is required' });
      }

      const { store, authorized } = await authorize(storeSlug, providedPassword);
      if (!store || !authorized) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const service = await prisma.service.create({
        data: {
          storeId: store.id,
          name,
          description: description || '',
          price: price !== undefined && price !== '' ? price : null,
        },
      });
      return res.status(201).json(service);
    }

    if (req.method === 'PATCH') {
      const { id, storeSlug, name, description, price } = req.body;
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

      const existing = await prisma.service.findUnique({ where: { id } });
      if (!existing || existing.storeId !== store.id) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price === '' ? null : price;

      const service = await prisma.service.update({ where: { id }, data: updateData });
      return res.json(service);
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

      const existing = await prisma.service.findUnique({ where: { id } });
      if (!existing || existing.storeId !== store.id) {
        return res.status(404).json({ error: 'Service not found' });
      }

      await prisma.service.delete({ where: { id } });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error managing service:', error);
    return res.status(500).json({ error: 'Failed to manage service' });
  }
}
