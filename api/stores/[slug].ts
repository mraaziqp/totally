import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { verifyStoreAccess, verifyMasterAccess } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;
  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  if (req.method === 'GET') {
    try {
      const store = await prisma.store.findUnique({
        where: { slug },
        include: {
          products: { orderBy: { createdAt: 'asc' } },
          services: true,
          testimonials: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        },
      });
      if (!store) return res.status(404).json({ error: 'Store not found' });
      const { password: _password, ...safeStore } = store;
      return res.json(safeStore);
    } catch (error) {
      console.error('Error fetching store:', error);
      return res.status(500).json({ error: 'Failed to fetch store' });
    }
  }

  if (req.method === 'PATCH') {
    // Protect CMS updates behind the store's own admin password
    const adminPassword = req.headers['x-admin-password'];
    const authStore = await prisma.store.findUnique({ where: { slug } });
    const providedPassword = typeof adminPassword === 'string' ? adminPassword : undefined;
    if (!authStore || !(verifyStoreAccess(providedPassword, authStore) || verifyMasterAccess(providedPassword))) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin password' });
    }

    try {
      const {
        heroHeadline,
        tagline,
        missionText,
        aboutUsText,
        heroImageUrl,
        heroImageEnabled,
        heroImageOpacity,
        aboutImageUrl,
        customBlocks,
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
        instagramUrl,
        facebookUrl,
        tiktokUrl,
        address,
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
      if (heroImageEnabled !== undefined) updateData.heroImageEnabled = Boolean(heroImageEnabled);
      if (heroImageOpacity !== undefined) {
        const opacity = Number(heroImageOpacity);
        if (!Number.isFinite(opacity)) {
          return res.status(400).json({ error: 'heroImageOpacity must be a number' });
        }
        updateData.heroImageOpacity = Math.min(100, Math.max(0, Math.round(opacity)));
      }
      if (aboutImageUrl !== undefined) updateData.aboutImageUrl = aboutImageUrl;
      if (customBlocks !== undefined) updateData.customBlocks = customBlocks;
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
      if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
      if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
      if (tiktokUrl !== undefined) updateData.tiktokUrl = tiktokUrl;
      if (address !== undefined) updateData.address = address;

      const store = await prisma.store.update({
        where: { slug },
        include: {
          products: { orderBy: { createdAt: 'asc' } },
          services: true,
          testimonials: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        },
        data: updateData,
      });

      console.log(`Store updated: ${slug}`);
      const { password: _password, ...safeStore } = store;
      return res.json(safeStore);
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
