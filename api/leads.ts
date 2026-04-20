import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { customerName, customerEmail, customerPhone, location, requestedDate, storeSlug } = req.body;

      if (!customerName || !customerEmail || !customerPhone || !location || !storeSlug) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const lead = await prisma.lead.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          location,
          requestedDate: requestedDate ? new Date(requestedDate) : null,
          storeId: store.id,
          status: 'NEW',
        },
      });

      return res.status(201).json(lead);
    } catch (error) {
      console.error('Error creating lead:', error);
      return res.status(500).json({ error: 'Failed to create lead' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
