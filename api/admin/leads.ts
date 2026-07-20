import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { verifyStoreAccess, verifyMasterAccess } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminPassword = req.headers['x-admin-password'];
  const providedPassword = typeof adminPassword === 'string' ? adminPassword : undefined;

  try {
    const { storeSlug } = req.query;

    const queryOptions: Record<string, unknown> = {
      orderBy: { createdAt: 'desc' },
    };

    if (storeSlug && typeof storeSlug === 'string') {
      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      queryOptions.where = { storeId: store.id };
    } else {
      // No store scope requested: only the master admin can see all leads
      if (!verifyMasterAccess(providedPassword)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const leads = await prisma.lead.findMany(queryOptions as Parameters<typeof prisma.lead.findMany>[0]);
    return res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}
