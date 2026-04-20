import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;
  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  if (req.method === 'GET') {
    try {
      const store = await prisma.store.findUnique({ where: { slug } });
      if (!store) return res.status(404).json({ error: 'Store not found' });
      return res.json(store);
    } catch (error) {
      console.error('Error fetching store:', error);
      return res.status(500).json({ error: 'Failed to fetch store' });
    }
  }

  if (req.method === 'PATCH') {
    // Protect CMS updates behind admin password
    const adminPassword = req.headers['x-admin-password'];
    if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const {
        heroHeadline,
        tagline,
        missionText,
        aboutUsText,
        heroImageUrl,
        servicesHeading,
        aboutHeading,
        testimonialText,
        testimonialAuthor,
        testimonialAuthorRole,
      } = req.body;

      const store = await prisma.store.update({
        where: { slug },
        data: {
          heroHeadline,
          tagline,
          missionText,
          aboutUsText,
          heroImageUrl,
          servicesHeading,
          aboutHeading,
          testimonialText,
          testimonialAuthor,
          testimonialAuthorRole,
        },
      });

      return res.json(store);
    } catch (error) {
      console.error('Error updating store:', error);
      return res.status(500).json({ error: 'Failed to update store' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
