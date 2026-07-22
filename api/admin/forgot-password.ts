import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { hashPassword } from '../_lib/auth.js';
import { sendPasswordResetEmail } from '../_lib/email.js';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storeSlug } = req.body;

    if (!storeSlug || typeof storeSlug !== 'string') {
      return res.status(400).json({ error: 'storeSlug is required' });
    }

    const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
    if (!store) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    // Password resets are an admin-facing (not customer-facing) notification,
    // so they go to the business owner's monitored inbox, not the store's
    // public contact address.
    const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL || 'cleandeep.cpt@gmail.com';

    // Generate a secure 8-character temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex');

    // Send the email FIRST — only persist the new password if it actually
    // sends. Otherwise a Resend outage would silently invalidate the old
    // password with no way to recover it.
    const emailResult = await sendPasswordResetEmail(
      store.name,
      store.slug,
      notifyEmail,
      tempPassword
    );

    if (!emailResult.success) {
      console.error(`Failed to send password reset email: ${emailResult.error}`);
      return res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
    }

    await prisma.store.update({
      where: { slug: storeSlug },
      data: { password: hashPassword(tempPassword) },
    });

    // Mask the email address in the response for security, e.g., d***g@gmail.com
    const [localPart, domain] = notifyEmail.split('@');
    const maskedLocal = localPart.length > 2
      ? `${localPart[0]}***${localPart[localPart.length - 1]}`
      : `${localPart[0]}***`;
    const maskedEmail = `${maskedLocal}@${domain}`;

    console.log(`Password reset email sent to ${notifyEmail} (${maskedEmail}) for ${storeSlug}`);
    return res.json({ 
      success: true, 
      message: `A temporary password has been sent to the registered email address: ${maskedEmail}` 
    });
  } catch (error) {
    console.error('Error in forgot-password handler:', error);
    return res.status(500).json({ error: 'An error occurred while resetting your password.' });
  }
}
