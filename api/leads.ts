import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './_lib/prisma.js';
import { sendBookingConfirmation, sendAdminNotification } from './_lib/email.js';

// Validation helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function sanitizeString(input: string): string {
  return input.trim().slice(0, 500);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerName, customerEmail, customerPhone, location, requestedDate, storeSlug, notes } = req.body;

    // Validate required fields exist
    if (!customerName || !customerEmail || !customerPhone || !location || !storeSlug) {
      return res.status(400).json({ error: 'Missing required fields: customerName, customerEmail, customerPhone, location, storeSlug' });
    }

    // Validate email format
    if (!isValidEmail(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // Validate phone format
    if (!isValidPhone(customerPhone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Sanitize string inputs
    const sanitizedName = sanitizeString(customerName);
    const sanitizedLocation = sanitizeString(location);
    const sanitizedSlug = sanitizeString(storeSlug);

    // Validate minimum length
    if (sanitizedName.length < 2) {
      return res.status(400).json({ error: 'Customer name must be at least 2 characters' });
    }

    if (sanitizedLocation.length < 2) {
      return res.status(400).json({ error: 'Location must be at least 2 characters' });
    }

    // Validate store exists
    const store = await prisma.store.findUnique({
      where: { slug: sanitizedSlug },
      select: { id: true, name: true }
    });

    if (!store) {
      return res.status(404).json({ error: `Store not found: ${sanitizedSlug}` });
    }

    // Validate and parse requested date if provided
    let parsedDate: Date | null = null;
    if (requestedDate) {
      const dateObj = new Date(requestedDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      // Ensure date is not in the past
      if (dateObj < new Date()) {
        return res.status(400).json({ error: 'Requested date must be in the future' });
      }
      parsedDate = dateObj;
    }

    // Sanitize optional notes (custom order details / product type)
    const sanitizedNotes = typeof notes === 'string' && notes.trim() ? sanitizeString(notes) : undefined;

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        customerName: sanitizedName,
        customerEmail: customerEmail.toLowerCase(),
        customerPhone: customerPhone.trim(),
        location: sanitizedLocation,
        requestedDate: parsedDate,
        notes: sanitizedNotes,
        storeId: store.id,
        status: 'NEW',
      },
    });

    // Send confirmation email to customer (non-blocking)
    sendBookingConfirmation({
      customerName: sanitizedName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone: customerPhone.trim(),
      location: sanitizedLocation,
      requestedDate: requestedDate,
      storeSlug: sanitizedSlug,
      storeName: store.name,
      notes: sanitizedNotes,
    }).catch(err => {
      console.error('Failed to send booking confirmation email:', err);
    });

    // Send admin notification (non-blocking)
    sendAdminNotification({
      customerName: sanitizedName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone: customerPhone.trim(),
      location: sanitizedLocation,
      requestedDate: requestedDate,
      storeSlug: sanitizedSlug,
      storeName: store.name,
      notes: sanitizedNotes,
    }).catch(err => {
      console.error('Failed to send admin notification email:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request received successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error creating lead:', error);

    // Don't expose internal error details to client
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Unique constraint failed')) {
      return res.status(409).json({ error: 'A booking with this email already exists' });
    }

    return res.status(500).json({ error: 'Failed to create booking request. Please try again later.' });
  }
}
