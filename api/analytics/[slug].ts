import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';

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
          leads: true,
          services: true,
          products: true,
        }
      });

      if (!store) return res.status(404).json({ error: 'Store not found' });

      // Calculate analytics
      const totalLeads = store.leads.length;
      const newLeads = store.leads.filter(l => l.status === 'NEW').length;
      const contactedLeads = store.leads.filter(l => l.status === 'CONTACTED').length;
      const completedLeads = store.leads.filter(l => l.status === 'COMPLETED').length;

      // Leads this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const leadsThisMonth = store.leads.filter(l => new Date(l.createdAt) >= thisMonth).length;

      // Average response time (if we had timestamps)
      const recentLeads = store.leads.slice(0, 10);

      const analytics = {
        storeName: store.name,
        totalLeads,
        newLeads,
        contactedLeads,
        completedLeads,
        conversionRate: totalLeads > 0 ? ((completedLeads / totalLeads) * 100).toFixed(1) : 0,
        leadsThisMonth,
        totalServices: store.services.length,
        totalProducts: store.products.length,
        responseRate: newLeads > 0 ? ((contactedLeads / newLeads) * 100).toFixed(1) : 0,
        recentLeads: recentLeads.map(l => ({
          id: l.id,
          customerName: l.customerName,
          location: l.location,
          status: l.status,
          createdAt: l.createdAt,
        })),
        lastUpdated: new Date(),
      };

      return res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
