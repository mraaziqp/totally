import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyHashedPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return keyBuffer.length === derivedKey.length && crypto.timingSafeEqual(keyBuffer, derivedKey);
}

export function constantTimeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  return aBuf.length === bBuf.length && crypto.timingSafeEqual(aBuf, bBuf);
}

/**
 * Hash a high-entropy bearer token (e.g. a quote accept/decline link) for
 * storage. Unlike passwords, these tokens are already random and unguessable,
 * so a fast deterministic hash is appropriate — it lets us look the token up
 * by its hash while never keeping the usable secret itself in the database.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verifies a provided password against a store's own (hashed) password,
 * falling back to the master ADMIN_PASSWORD for stores that haven't set one yet.
 */
export function verifyStoreAccess(provided: string | undefined, store: { password?: string | null }): boolean {
  if (!provided) return false;
  if (store.password) {
    return verifyHashedPassword(provided, store.password);
  }
  if (process.env.ADMIN_PASSWORD) {
    return constantTimeEqual(provided, process.env.ADMIN_PASSWORD);
  }
  return false;
}

export function verifyMasterAccess(provided: string | undefined): boolean {
  if (!provided || !process.env.ADMIN_PASSWORD) return false;
  return constantTimeEqual(provided, process.env.ADMIN_PASSWORD);
}
