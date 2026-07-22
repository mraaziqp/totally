import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './_lib/prisma.js';
import { hashToken } from './_lib/auth.js';
import { sendQuoteDecisionAdminNotification, sendQuoteDecisionCustomerConfirmation } from './_lib/email.js';

// Public endpoint — the token itself is the authentication. Customers reach
// this via the link in their quote email, with no admin password involved.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'token is required' });
      }

      const lead = await prisma.lead.findUnique({ where: { quoteTokenHash: hashToken(token) }, include: { store: true } });
      if (!lead) {
        return res.status(404).json({ error: 'Quote not found' });
      }

      return res.json({
        customerName: lead.customerName,
        storeName: lead.store.name,
        amount: lead.quoteAmount,
        message: lead.quoteMessage,
        status: lead.quoteStatus,
        respondedAt: lead.quoteRespondedAt,
      });
    } catch (error) {
      console.error('Error fetching quote:', error);
      return res.status(500).json({ error: 'Failed to fetch quote' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { token, action } = req.body;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'token is required' });
      }
      if (action !== 'accept' && action !== 'decline') {
        return res.status(400).json({ error: 'action must be "accept" or "decline"' });
      }

      const lead = await prisma.lead.findUnique({ where: { quoteTokenHash: hashToken(token) }, include: { store: true } });
      if (!lead) {
        return res.status(404).json({ error: 'Quote not found' });
      }
      if (lead.quoteStatus !== 'SENT') {
        // Already responded (or no quote was ever sent) — return the
        // current state instead of erroring, so a re-click of an old link
        // (or an email client pre-fetching it) doesn't look like a failure.
        return res.json({ success: true, status: lead.quoteStatus, alreadyResponded: true });
      }

      const decision = action === 'accept' ? 'ACCEPTED' : 'DECLINED';

      const updated = await prisma.lead.update({
        where: { id: lead.id },
        data: { quoteStatus: decision, quoteRespondedAt: new Date() },
      });

      const amount = lead.quoteAmount ? Number(lead.quoteAmount) : 0;

      const [adminResult, customerResult] = await Promise.allSettled([
        sendQuoteDecisionAdminNotification({
          customerName: lead.customerName,
          customerEmail: lead.customerEmail,
          customerPhone: lead.customerPhone,
          storeName: lead.store.name,
          storeSlug: lead.store.slug,
          amount,
          decision,
        }),
        sendQuoteDecisionCustomerConfirmation({
          customerName: lead.customerName,
          customerEmail: lead.customerEmail,
          storeName: lead.store.name,
          decision,
        }),
      ]);

      if (adminResult.status === 'rejected') {
        console.error('Failed to send quote decision admin notification:', adminResult.reason);
      }
      if (customerResult.status === 'rejected') {
        console.error('Failed to send quote decision customer confirmation:', customerResult.reason);
      }

      return res.json({ success: true, status: updated.quoteStatus });
    } catch (error) {
      console.error('Error recording quote decision:', error);
      return res.status(500).json({ error: 'Failed to record your response' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
