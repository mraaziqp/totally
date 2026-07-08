import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';
import { hashPassword } from '../_lib/auth';
import { sendPasswordResetEmail } from '../_lib/email';
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

    if (!store.contactEmail) {
      return res.status(400).json({ error: 'This unit does not have a configured contact email. Please contact the system administrator.' });
    }

    // Generate a secure 8-character temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex');

    // Hash and save the temporary password to the database
    await prisma.store.update({
      where: { slug: storeSlug },
      data: { password: hashPassword(tempPassword) },
    });

    // Send the password reset email using Resend
    const emailResult = await sendPasswordResetEmail(
      store.name,
      store.slug,
      store.contactEmail,
      tempPassword
    );

    if (!emailResult.success) {
      console.error(`Failed to send password reset email: ${emailResult.error}`);
      return res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
    }

    // Mask the email address in the response for security, e.g., d***g@totally.co.za
    const email = store.contactEmail;
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.length > 2 
      ? `${localPart[0]}***${localPart[localPart.length - 1]}` 
      : `${localPart[0]}***`;
    const maskedEmail = `${maskedLocal}@${domain}`;

    console.log(`Password reset email sent to ${store.contactEmail} (${maskedEmail}) for ${storeSlug}`);
    return res.json({ 
      success: true, 
      message: `A temporary password has been sent to the registered email address: ${maskedEmail}` 
    });
  } catch (error) {
    console.error('Error in forgot-password handler:', error);
    return res.status(500).json({ error: 'An error occurred while resetting your password.' });
  }
}
