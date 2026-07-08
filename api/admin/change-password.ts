import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';
import { hashPassword, verifyStoreAccess, verifyMasterAccess } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storeSlug, currentPassword, newPassword } = req.body;

    if (!storeSlug || typeof storeSlug !== 'string') {
      return res.status(400).json({ error: 'storeSlug is required' });
    }
    if (!currentPassword || typeof currentPassword !== 'string') {
      return res.status(400).json({ error: 'Current password is required' });
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const authorized = verifyStoreAccess(currentPassword, store) || verifyMasterAccess(currentPassword);
    if (!authorized) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    await prisma.store.update({
      where: { slug: storeSlug },
      data: { password: hashPassword(newPassword) },
    });

    console.log(`Password changed for store: ${storeSlug}`);
    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
}
