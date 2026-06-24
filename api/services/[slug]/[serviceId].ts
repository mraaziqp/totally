import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug, serviceId } = req.query;
  if (typeof slug !== 'string' || typeof serviceId !== 'string') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  // PATCH: Update a service (admin only)
  if (req.method === 'PATCH') {
    const adminPassword = req.headers['x-admin-password'];
    if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { name, description, price } = req.body;

      const service = await prisma.service.update({
        where: { id: serviceId },
        data: {
          name: name ?? undefined,
          description: description ?? undefined,
          price: price ? parseFloat(price) : undefined,
        }
      });

      return res.json(service);
    } catch (error) {
      console.error('Error updating service:', error);
      return res.status(500).json({ error: 'Failed to update service' });
    }
  }

  // DELETE: Delete a service (admin only)
  if (req.method === 'DELETE') {
    const adminPassword = req.headers['x-admin-password'];
    if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      await prisma.service.delete({
        where: { id: serviceId }
      });

      return res.json({ success: true, message: 'Service deleted' });
    } catch (error) {
      console.error('Error deleting service:', error);
      return res.status(500).json({ error: 'Failed to delete service' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
