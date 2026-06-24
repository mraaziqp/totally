import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;
  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  if (req.method === 'GET') {
    try {
      const store = await prisma.store.findUnique({ where: { slug }, include: { products: { orderBy: { createdAt: 'asc' } } } });
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
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin password' });
    }

    try {
      const {
        heroHeadline,
        tagline,
        missionText,
        aboutUsText,
        heroImageUrl,
        servicesHeadline,
        servicesDescription,
        aboutHeading,
        testimonialText,
        testimonialAuthor,
        testimonialAuthorRole,
        galleryImages,
        deliveryNote,
        contactPhone,
        contactEmail,
        pageTitle,
        pageDescription,
      } = req.body;

      // Validate email format if provided
      if (contactEmail && !contactEmail.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Build update data with only provided fields
      const updateData: Record<string, any> = {};
      if (heroHeadline !== undefined) updateData.heroHeadline = heroHeadline;
      if (tagline !== undefined) updateData.tagline = tagline;
      if (missionText !== undefined) updateData.missionText = missionText;
      if (aboutUsText !== undefined) updateData.aboutUsText = aboutUsText;
      if (heroImageUrl !== undefined) updateData.heroImageUrl = heroImageUrl;
      if (servicesHeadline !== undefined) updateData.servicesHeadline = servicesHeadline;
      if (servicesDescription !== undefined) updateData.servicesDescription = servicesDescription;
      if (aboutHeading !== undefined) updateData.aboutHeading = aboutHeading;
      if (testimonialText !== undefined) updateData.testimonialText = testimonialText;
      if (testimonialAuthor !== undefined) updateData.testimonialAuthor = testimonialAuthor;
      if (testimonialAuthorRole !== undefined) updateData.testimonialAuthorRole = testimonialAuthorRole;
      if (galleryImages !== undefined) updateData.galleryImages = galleryImages;
      if (deliveryNote !== undefined) updateData.deliveryNote = deliveryNote;
      if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
      if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
      if (pageTitle !== undefined) updateData.pageTitle = pageTitle;
      if (pageDescription !== undefined) updateData.pageDescription = pageDescription;

      const store = await prisma.store.update({
        where: { slug },
        include: { products: { orderBy: { createdAt: 'asc' } }, services: true },
        data: updateData,
      });

      console.log(`Store updated: ${slug}`);
      return res.json({ success: true, data: store });
    } catch (error) {
      console.error('Error updating store:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: `Store not found: ${slug}` });
      }
      return res.status(500).json({ error: 'Failed to update store' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
