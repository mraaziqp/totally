import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';
import { verifyStoreAccess, verifyMasterAccess } from '../_lib/auth';

// Simple in-memory rate limiting (resets per deployment)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  return typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, resetTime: now + LOCKOUT_DURATION });
    return { allowed: true };
  }

  if (now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + LOCKOUT_DURATION });
    return { allowed: true };
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    const minutesLeft = Math.ceil((attempt.resetTime - now) / 60000);
    return {
      allowed: false,
      message: `Too many login attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`
    };
  }

  attempt.count++;
  return { allowed: true };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, storeSlug } = req.body;

    // Validate input
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Check environment
    if (!process.env.ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD not configured');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    // Check rate limiting
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return res.status(429).json({ error: rateLimit.message });
    }

    let isMatch = false;

    if (storeSlug && typeof storeSlug === 'string') {
      // Tenant login: the store's own password works, and the master password always works too
      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (store) {
        isMatch = verifyStoreAccess(password, store) || verifyMasterAccess(password);
      }
    } else {
      // Super-admin login
      isMatch = verifyMasterAccess(password);
    }

    if (isMatch) {
      // Reset rate limiting on successful login
      loginAttempts.delete(clientIp);
      console.log(`Successful admin login from ${clientIp}${storeSlug ? ` (store: ${storeSlug})` : ''}`);
      return res.status(200).json({ success: true, message: 'Authentication successful' });
    }

    console.warn(`Failed admin login attempt from ${clientIp}`);
    return res.status(401).json({ error: 'Incorrect password' });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
}
