import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendTestEmail } from './_lib/email.js';
import { prisma } from './_lib/prisma.js';
import { verifyStoreAccess, verifyMasterAccess } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, storeSlug } = req.body;
    const adminPassword = req.headers['x-admin-password'];
    const providedPassword = typeof adminPassword === 'string' ? adminPassword : undefined;

    if (!storeSlug || typeof storeSlug !== 'string') {
      return res.status(400).json({ error: 'storeSlug is required' });
    }

    const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
    if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email address required' });
    }

    const result = await sendTestEmail(email);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
        sentTo: email,
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send test email',
    });
  }
}
