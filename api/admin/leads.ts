import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { prisma } from '../_lib/prisma.js';
import { verifyStoreAccess, verifyMasterAccess } from '../_lib/auth.js';
import { sendClientUpdate, sendQuoteEmail } from '../_lib/email.js';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const adminPassword = req.headers['x-admin-password'];
  const providedPassword = typeof adminPassword === 'string' ? adminPassword : undefined;

  // ── GET — list leads for a store ──────────────────────────────────────────
  if (req.method === 'GET') {
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

  // ── PATCH — update a lead's status / internal notes ───────────────────────
  if (req.method === 'PATCH') {
    try {
      const { leadId, storeSlug, status, internalNotes } = req.body;

      if (!leadId || typeof leadId !== 'string') {
        return res.status(400).json({ error: 'leadId is required' });
      }
      if (!storeSlug || typeof storeSlug !== 'string') {
        return res.status(400).json({ error: 'storeSlug is required' });
      }

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead || lead.storeId !== store.id) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const updateData: Record<string, unknown> = {};
      if (status !== undefined) {
        if (!VALID_STATUSES.includes(status)) {
          return res.status(400).json({ error: `Invalid status. Use one of: ${VALID_STATUSES.join(', ')}` });
        }
        updateData.status = status;
      }
      if (internalNotes !== undefined) {
        updateData.notes = internalNotes;
      }

      const updated = await prisma.lead.update({ where: { id: leadId }, data: updateData });
      return res.json(updated);
    } catch (error) {
      console.error('Error updating lead:', error);
      return res.status(500).json({ error: 'Failed to update booking' });
    }
  }

  // ── POST /api/admin/leads — send an update or a quote to the customer ─────
  if (req.method === 'POST') {
    const { action } = req.body;

    // ── Send a quote with an accept/decline link ──────────────────────────
    if (action === 'sendQuote') {
      try {
        const { leadId, storeSlug, amount, message } = req.body;

        if (!leadId || typeof leadId !== 'string') {
          return res.status(400).json({ error: 'leadId is required' });
        }
        if (!storeSlug || typeof storeSlug !== 'string') {
          return res.status(400).json({ error: 'storeSlug is required' });
        }
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
          return res.status(400).json({ error: 'A valid quote amount is required' });
        }

        const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
        if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead || lead.storeId !== store.id) {
          return res.status(404).json({ error: 'Booking not found' });
        }

        const token = crypto.randomBytes(24).toString('hex');

        const result = await sendQuoteEmail({
          customerName: lead.customerName,
          customerEmail: lead.customerEmail,
          storeName: store.name,
          amount: numericAmount,
          message: typeof message === 'string' ? message : undefined,
          token,
        });

        if (!result.success) {
          return res.status(500).json({ error: result.error || 'Failed to send quote email' });
        }

        const updated = await prisma.lead.update({
          where: { id: leadId },
          data: {
            quoteAmount: numericAmount,
            quoteMessage: typeof message === 'string' ? message : null,
            quoteToken: token,
            quoteStatus: 'SENT',
            quoteSentAt: new Date(),
            quoteRespondedAt: null,
          },
        });

        return res.json({ success: true, messageId: result.messageId, lead: updated });
      } catch (error) {
        console.error('Error sending quote:', error);
        return res.status(500).json({ error: 'Failed to send quote' });
      }
    }

    // ── Default: send a status/general update email to the customer ───────
    try {
      const { leadId, storeSlug, message, newStatus } = req.body;

      if (!leadId || !storeSlug || !message) {
        return res.status(400).json({ error: 'leadId, storeSlug, and message are required' });
      }

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead || lead.storeId !== store.id) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Optionally update the status at the same time
      if (newStatus && VALID_STATUSES.includes(newStatus)) {
        await prisma.lead.update({ where: { id: leadId }, data: { status: newStatus } });
      }

      const result = await sendClientUpdate({
        customerName: lead.customerName,
        customerEmail: lead.customerEmail,
        storeName: store.name,
        storeSlug,
        message,
        status: newStatus || lead.status,
      });

      if (!result.success) {
        return res.status(500).json({ error: result.error || 'Failed to send email' });
      }

      return res.json({ success: true, messageId: result.messageId });
    } catch (error) {
      console.error('Error sending client update:', error);
      return res.status(500).json({ error: 'Failed to send client update' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
