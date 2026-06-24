import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;
  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  // GET: Fetch all services for a store
  if (req.method === 'GET') {
    try {
      const store = await prisma.store.findUnique({
        where: { slug },
        include: { services: { orderBy: { createdAt: 'asc' } } }
      });
      if (!store) return res.status(404).json({ error: 'Store not found' });
      return res.json(store.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      return res.status(500).json({ error: 'Failed to fetch services' });
    }
  }

  // POST: Create a new service (admin only)
  if (req.method === 'POST') {
    const adminPassword = req.headers['x-admin-password'];
    if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { name, description, price } = req.body;
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }

      const store = await prisma.store.findUnique({ where: { slug } });
      if (!store) return res.status(404).json({ error: 'Store not found' });

      const service = await prisma.service.create({
        data: {
          storeId: store.id,
          name,
          description,
          price: price ? parseFloat(price) : null,
        }
      });

      return res.json(service);
    } catch (error) {
      console.error('Error creating service:', error);
      return res.status(500).json({ error: 'Failed to create service' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
