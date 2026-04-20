import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate admin password via header to protect lead data
  const adminPassword = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { storeSlug } = req.query;

    const queryOptions: Record<string, unknown> = {
      orderBy: { createdAt: 'desc' },
    };

    if (storeSlug && typeof storeSlug === 'string') {
      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (store) {
        queryOptions.where = { storeId: store.id };
      }
    }

    const leads = await prisma.lead.findMany(queryOptions as Parameters<typeof prisma.lead.findMany>[0]);
    return res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}
