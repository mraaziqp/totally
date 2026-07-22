import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import { sendBookingConfirmation, sendAdminNotification, sendPasswordResetEmail, sendClientUpdate, sendTestEmail, sendQuoteEmail, sendQuoteDecisionAdminNotification, sendQuoteDecisionCustomerConfirmation } from "./api/_lib/email";
import { hashPassword, verifyStoreAccess, verifyMasterAccess, hashToken } from "./api/_lib/auth";
import { getSupabaseAdmin, MEDIA_BUCKET } from "./api/_lib/supabase";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes

  // Validation helpers — kept in sync with api/leads.ts
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }
  function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
  function sanitizeString(input: string, maxLen = 5000): string {
    return input.trim().slice(0, maxLen);
  }

  // Submit a lead (Deep Cleaning / Pressure Cleaning)
  app.post("/api/leads", async (req, res) => {
    try {
      const { customerName, customerEmail, customerPhone, location, requestedDate, storeSlug, notes } = req.body;

      if (!customerName || !customerEmail || !customerPhone || !location || !storeSlug) {
        return res.status(400).json({ error: 'Missing required fields: customerName, customerEmail, customerPhone, location, storeSlug' });
      }
      if (!isValidEmail(customerEmail)) {
        return res.status(400).json({ error: 'Invalid email address format' });
      }
      if (!isValidPhone(customerPhone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }

      const sanitizedName = sanitizeString(customerName);
      const sanitizedLocation = sanitizeString(location);
      const sanitizedSlug = sanitizeString(storeSlug);

      if (sanitizedName.length < 2) {
        return res.status(400).json({ error: 'Customer name must be at least 2 characters' });
      }
      if (sanitizedLocation.length < 2) {
        return res.status(400).json({ error: 'Location must be at least 2 characters' });
      }

      const store = await prisma.store.findUnique({
        where: { slug: sanitizedSlug },
        select: { id: true, name: true },
      });
      if (!store) {
        return res.status(404).json({ error: `Store not found: ${sanitizedSlug}` });
      }

      let parsedDate: Date | null = null;
      if (requestedDate) {
        const dateObj = new Date(requestedDate);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ error: 'Invalid date format' });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateObj < today) {
          return res.status(400).json({ error: 'Requested date must be today or in the future' });
        }
        parsedDate = dateObj;
      }

      const sanitizedNotes = typeof notes === 'string' && notes.trim() ? sanitizeString(notes) : undefined;

      const lead = await prisma.lead.create({
        data: {
          customerName: sanitizedName,
          customerEmail: customerEmail.toLowerCase(),
          customerPhone: customerPhone.trim(),
          location: sanitizedLocation,
          requestedDate: parsedDate,
          notes: sanitizedNotes,
          storeId: store.id,
          status: "NEW",
        },
      });

      const emailPayload = {
        customerName: sanitizedName,
        customerEmail: customerEmail.toLowerCase(),
        customerPhone: customerPhone.trim(),
        location: sanitizedLocation,
        requestedDate,
        storeSlug: sanitizedSlug,
        storeName: store.name,
        notes: sanitizedNotes,
      };

      const [confResult, adminResult] = await Promise.allSettled([
        sendBookingConfirmation(emailPayload),
        sendAdminNotification(emailPayload),
      ]);
      if (confResult.status === 'rejected') {
        console.error('Booking confirmation email failed:', confResult.reason);
      } else {
        console.log('Booking confirmation email sent:', confResult.value);
      }
      if (adminResult.status === 'rejected') {
        console.error('Admin notification email failed:', adminResult.reason);
      } else {
        console.log('Admin notification email sent:', adminResult.value);
      }

      res.status(201).json({ success: true, message: 'Booking request received successfully', data: lead });
    } catch (error) {
      console.error("Error creating lead:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Unique constraint failed')) {
        return res.status(409).json({ error: 'A booking with this email already exists' });
      }
      res.status(500).json({ error: "Failed to create booking request. Please try again later." });
    }
  });

  // Admin: Send a test email to verify Resend configuration
  app.post("/api/test-email", async (req, res) => {
    try {
      const { email, storeSlug } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;

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
        res.status(200).json({
          success: true,
          message: 'Test email sent successfully',
          messageId: result.messageId,
          sentTo: email,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed to send test email" });
    }
  });

  // Admin: Auth (per-tenant password, falls back to master ADMIN_PASSWORD)
  app.post("/api/admin/auth", async (req, res) => {
    const { password, storeSlug } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }
    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'Server misconfigured — ADMIN_PASSWORD not set in .env' });
    }

    let isMatch = false;
    if (storeSlug && typeof storeSlug === 'string') {
      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (store) isMatch = verifyStoreAccess(password, store) || verifyMasterAccess(password);
    } else {
      isMatch = verifyMasterAccess(password);
    }

    if (isMatch) return res.status(200).json({ success: true, ok: true });
    return res.status(401).json({ error: 'Incorrect password' });
  });

  // Admin: Change a store's own password
  app.post("/api/admin/change-password", async (req, res) => {
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
      if (!store) return res.status(404).json({ error: 'Store not found' });

      const authorized = verifyStoreAccess(currentPassword, store) || verifyMasterAccess(currentPassword);
      if (!authorized) return res.status(401).json({ error: 'Current password is incorrect' });

      await prisma.store.update({ where: { slug: storeSlug }, data: { password: hashPassword(newPassword) } });
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Admin: Forgot Password (resets password to temporary code and emails the manager)
  app.post("/api/admin/forgot-password", async (req, res) => {
    try {
      const { storeSlug } = req.body;
      if (!storeSlug || typeof storeSlug !== 'string') {
        return res.status(400).json({ error: 'storeSlug is required' });
      }

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store) return res.status(404).json({ error: 'Store not found' });

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

      await prisma.store.update({ where: { slug: storeSlug }, data: { password: hashPassword(tempPassword) } });

      const [localPart, domain] = notifyEmail.split('@');
      const maskedLocal = localPart.length > 2
        ? `${localPart[0]}***${localPart[localPart.length - 1]}`
        : `${localPart[0]}***`;
      const maskedEmail = `${maskedLocal}@${domain}`;

      res.json({ 
        success: true, 
        message: `A temporary password has been sent to the registered email address: ${maskedEmail}` 
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // Admin: Manage services (create / update / delete)
  app.post("/api/admin/services", async (req, res) => {
    try {
      const { storeSlug, name, description, price } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;
      if (!storeSlug || !name) return res.status(400).json({ error: 'storeSlug and name are required' });

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const service = await prisma.service.create({
        data: { storeId: store.id, name, description: description || '', price: price !== undefined && price !== '' ? price : null },
      });
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.patch("/api/admin/services", async (req, res) => {
    try {
      const { id, storeSlug, name, description, price } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;
      if (!id || !storeSlug) return res.status(400).json({ error: 'id and storeSlug are required' });

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const existing = await prisma.service.findUnique({ where: { id } });
      if (!existing || existing.storeId !== store.id) return res.status(404).json({ error: 'Service not found' });

      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price === '' ? null : price;

      const service = await prisma.service.update({ where: { id }, data: updateData });
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services", async (req, res) => {
    try {
      const { id, storeSlug } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;
      if (!id || !storeSlug) return res.status(400).json({ error: 'id and storeSlug are required' });

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const existing = await prisma.service.findUnique({ where: { id } });
      if (!existing || existing.storeId !== store.id) return res.status(404).json({ error: 'Service not found' });

      await prisma.service.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Admin: Upload an image to Supabase Storage (about photo, gallery, testimonial avatar)
  const UPLOAD_ALLOWED_TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  const UPLOAD_MAX_BYTES = 3 * 1024 * 1024; // keep base64 payload under Vercel's ~4.5MB request body cap

  app.post("/api/admin/upload", async (req, res) => {
    try {
      const { storeSlug, fileType, dataBase64, folder } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;

      if (!storeSlug || typeof storeSlug !== 'string') {
        return res.status(400).json({ error: 'storeSlug is required' });
      }
      if (!fileType || !UPLOAD_ALLOWED_TYPES[fileType]) {
        return res.status(400).json({ error: 'Unsupported image type. Use JPG, PNG, WEBP, or GIF.' });
      }
      if (!dataBase64 || typeof dataBase64 !== 'string') {
        return res.status(400).json({ error: 'No file data received' });
      }

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const buffer = Buffer.from(dataBase64, 'base64');
      if (buffer.length > UPLOAD_MAX_BYTES) {
        return res.status(400).json({ error: 'Image is too large. Please keep uploads under 3MB.' });
      }

      const ext = UPLOAD_ALLOWED_TYPES[fileType];
      const safeFolder = (typeof folder === 'string' && /^[a-z0-9-]+$/i.test(folder)) ? folder : 'uploads';
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `${storeSlug}/${safeFolder}/${safeName}`;

      let supabase;
      try {
        supabase = getSupabaseAdmin();
      } catch (e) {
        return res.status(503).json({ error: (e as Error).message });
      }

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, buffer, { contentType: fileType, upsert: false });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return res.status(502).json({
          error: `Image storage upload failed: ${uploadError.message}. Make sure a public bucket named "${MEDIA_BUCKET}" exists in your Supabase project.`,
        });
      }

      const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      res.status(201).json({ url: publicUrlData.publicUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Admin: Manage testimonials (create / update / delete)
  function clampRating(value: unknown): number {
    const n = Number(value);
    if (!Number.isFinite(n)) return 5;
    return Math.min(5, Math.max(1, Math.round(n)));
  }

  app.post("/api/admin/testimonials", async (req, res) => {
    try {
      const { storeSlug, authorName, authorRole, quote, rating, avatarUrl, isPublished, displayOrder } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;
      if (!storeSlug || !authorName || !quote) {
        return res.status(400).json({ error: 'storeSlug, authorName and quote are required' });
      }

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const testimonial = await prisma.testimonial.create({
        data: {
          storeId: store.id,
          authorName,
          authorRole: authorRole || null,
          quote,
          rating: clampRating(rating),
          avatarUrl: avatarUrl || null,
          isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
          displayOrder: Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : 0,
        },
      });
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.patch("/api/admin/testimonials", async (req, res) => {
    try {
      const { id, storeSlug, authorName, authorRole, quote, rating, avatarUrl, isPublished, displayOrder } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;
      if (!id || !storeSlug) return res.status(400).json({ error: 'id and storeSlug are required' });

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (!existing || existing.storeId !== store.id) return res.status(404).json({ error: 'Testimonial not found' });

      const updateData: Record<string, unknown> = {};
      if (authorName !== undefined) updateData.authorName = authorName;
      if (authorRole !== undefined) updateData.authorRole = authorRole || null;
      if (quote !== undefined) updateData.quote = quote;
      if (rating !== undefined) updateData.rating = clampRating(rating);
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl || null;
      if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);
      if (displayOrder !== undefined) updateData.displayOrder = Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : 0;

      const testimonial = await prisma.testimonial.update({ where: { id }, data: updateData });
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials", async (req, res) => {
    try {
      const { id, storeSlug } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;
      if (!id || !storeSlug) return res.status(400).json({ error: 'id and storeSlug are required' });

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (!existing || existing.storeId !== store.id) return res.status(404).json({ error: 'Testimonial not found' });

      await prisma.testimonial.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Admin: Get all leads (store-scoped requires that store's password; unscoped requires master password)
  app.get("/api/admin/leads", async (req, res) => {
    try {
      const { storeSlug } = req.query;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;

      const queryOptions: any = {
        orderBy: { createdAt: 'desc' }
      };

      if (storeSlug) {
        const store = await prisma.store.findUnique({
          where: { slug: storeSlug as string }
        });
        if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        queryOptions.where = { storeId: store.id };
      } else {
        if (!verifyMasterAccess(providedPassword)) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      }

      const leads = await prisma.lead.findMany(queryOptions);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  const LEAD_VALID_STATUSES = ['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  // Admin: Update a lead's status / internal notes
  app.patch("/api/admin/leads", async (req, res) => {
    try {
      const { leadId, storeSlug, status, internalNotes } = req.body;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;

      if (!leadId || typeof leadId !== 'string') return res.status(400).json({ error: 'leadId is required' });
      if (!storeSlug || typeof storeSlug !== 'string') return res.status(400).json({ error: 'storeSlug is required' });

      const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
      if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead || lead.storeId !== store.id) return res.status(404).json({ error: 'Booking not found' });

      const updateData: Record<string, unknown> = {};
      if (status !== undefined) {
        if (!LEAD_VALID_STATUSES.includes(status)) {
          return res.status(400).json({ error: `Invalid status. Use one of: ${LEAD_VALID_STATUSES.join(', ')}` });
        }
        updateData.status = status;
      }
      if (internalNotes !== undefined) updateData.notes = internalNotes;

      const updated = await prisma.lead.update({ where: { id: leadId }, data: updateData });
      res.json(updated);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  // Admin: Send a status-update email to the customer, or a quote (action: 'sendQuote')
  app.post("/api/admin/leads", async (req, res) => {
    const providedPassword = req.headers['x-admin-password'] as string | undefined;
    const { action } = req.body;

    if (action === 'sendQuote') {
      try {
        const { leadId, storeSlug, amount, message } = req.body;

        if (!leadId || typeof leadId !== 'string') return res.status(400).json({ error: 'leadId is required' });
        if (!storeSlug || typeof storeSlug !== 'string') return res.status(400).json({ error: 'storeSlug is required' });
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
          return res.status(400).json({ error: 'A valid quote amount is required' });
        }

        const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
        if (!store || !(verifyStoreAccess(providedPassword, store) || verifyMasterAccess(providedPassword))) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead || lead.storeId !== store.id) return res.status(404).json({ error: 'Booking not found' });

        const token = crypto.randomBytes(24).toString('hex');

        const result = await sendQuoteEmail({
          customerName: lead.customerName,
          customerEmail: lead.customerEmail,
          storeName: store.name,
          amount: numericAmount,
          message: typeof message === 'string' ? message : undefined,
          token,
        });

        if (!result.success) return res.status(500).json({ error: result.error || 'Failed to send quote email' });

        const updated = await prisma.lead.update({
          where: { id: leadId },
          data: {
            quoteAmount: numericAmount,
            quoteMessage: typeof message === 'string' ? message : null,
            quoteTokenHash: hashToken(token),
            quoteStatus: 'SENT',
            quoteSentAt: new Date(),
            quoteRespondedAt: null,
          },
        });

        return res.json({ success: true, messageId: result.messageId, lead: updated });
      } catch (error) {
        console.error("Error sending quote:", error);
        return res.status(500).json({ error: "Failed to send quote" });
      }
    }

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
      if (!lead || lead.storeId !== store.id) return res.status(404).json({ error: 'Booking not found' });

      if (newStatus && LEAD_VALID_STATUSES.includes(newStatus)) {
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

      if (!result.success) return res.status(500).json({ error: result.error || 'Failed to send email' });
      res.json({ success: true, messageId: result.messageId });
    } catch (error) {
      console.error("Error sending client update:", error);
      res.status(500).json({ error: "Failed to send client update" });
    }
  });

  // Public: fetch quote details by token
  app.get("/api/quote", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') return res.status(400).json({ error: 'token is required' });

      const lead = await prisma.lead.findUnique({ where: { quoteTokenHash: hashToken(token) }, include: { store: true } });
      if (!lead) return res.status(404).json({ error: 'Quote not found' });

      res.json({
        customerName: lead.customerName,
        storeName: lead.store.name,
        amount: lead.quoteAmount,
        message: lead.quoteMessage,
        status: lead.quoteStatus,
        respondedAt: lead.quoteRespondedAt,
      });
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({ error: "Failed to fetch quote" });
    }
  });

  // Public: accept or decline a quote
  app.post("/api/quote", async (req, res) => {
    try {
      const { token, action } = req.body;
      if (!token || typeof token !== 'string') return res.status(400).json({ error: 'token is required' });
      if (action !== 'accept' && action !== 'decline') {
        return res.status(400).json({ error: 'action must be "accept" or "decline"' });
      }

      const lead = await prisma.lead.findUnique({ where: { quoteTokenHash: hashToken(token) }, include: { store: true } });
      if (!lead) return res.status(404).json({ error: 'Quote not found' });
      if (lead.quoteStatus !== 'SENT') {
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

      if (adminResult.status === 'rejected') console.error('Failed to send quote decision admin notification:', adminResult.reason);
      if (customerResult.status === 'rejected') console.error('Failed to send quote decision customer confirmation:', customerResult.reason);

      res.json({ success: true, status: updated.quoteStatus });
    } catch (error) {
      console.error("Error recording quote decision:", error);
      res.status(500).json({ error: "Failed to record your response" });
    }
  });

  // Get store details (public — password is stripped from the response)
  app.get("/api/stores/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const store = await prisma.store.findUnique({
        where: { slug },
        include: {
          products: { orderBy: { createdAt: 'asc' } },
          services: { orderBy: { createdAt: 'asc' } },
          testimonials: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        },
      });
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      const { password: _password, ...safeStore } = store;
      res.json(safeStore);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ error: "Failed to fetch store" });
    }
  });

  // Update store details (CMS) — requires that store's own admin password
  app.patch("/api/stores/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const providedPassword = req.headers['x-admin-password'] as string | undefined;

      const authStore = await prisma.store.findUnique({ where: { slug } });
      if (!authStore || !(verifyStoreAccess(providedPassword, authStore) || verifyMasterAccess(providedPassword))) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin password' });
      }

      const {
        pageTitle,
        pageDescription,
        heroHeadline,
        tagline,
        missionText,
        aboutUsText,
        heroImageUrl,
        heroImageEnabled,
        heroImageOpacity,
        aboutImageUrl,
        customBlocks,
        pageBackgroundImageUrl,
        pageBackgroundEnabled,
        pageBackgroundOpacity,
        servicesHeadline,
        servicesDescription,
        aboutHeading,
        testimonialText,
        testimonialAuthor,
        testimonialAuthorRole,
        galleryImages,
        deliveryNote,
        contactPhone,
        contactEmail,
        instagramUrl,
        facebookUrl,
        tiktokUrl,
        address,
      } = req.body;

      // Validate email format if provided
      if (contactEmail && !contactEmail.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Build update data with only provided fields
      const updateData: Record<string, any> = {};
      if (heroHeadline !== undefined) updateData.heroHeadline = heroHeadline;
      if (tagline !== undefined) updateData.tagline = tagline;
      if (missionText !== undefined) updateData.missionText = missionText;
      if (aboutUsText !== undefined) updateData.aboutUsText = aboutUsText;
      if (heroImageUrl !== undefined) updateData.heroImageUrl = heroImageUrl;
      if (heroImageEnabled !== undefined) updateData.heroImageEnabled = Boolean(heroImageEnabled);
      if (heroImageOpacity !== undefined) {
        const opacity = Number(heroImageOpacity);
        if (!Number.isFinite(opacity)) {
          return res.status(400).json({ error: 'heroImageOpacity must be a number' });
        }
        updateData.heroImageOpacity = Math.min(100, Math.max(0, Math.round(opacity)));
      }
      if (aboutImageUrl !== undefined) updateData.aboutImageUrl = aboutImageUrl;
      if (customBlocks !== undefined) updateData.customBlocks = customBlocks;
      if (pageBackgroundImageUrl !== undefined) updateData.pageBackgroundImageUrl = pageBackgroundImageUrl;
      if (pageBackgroundEnabled !== undefined) updateData.pageBackgroundEnabled = Boolean(pageBackgroundEnabled);
      if (pageBackgroundOpacity !== undefined) {
        const bgOpacity = Number(pageBackgroundOpacity);
        if (!Number.isFinite(bgOpacity)) {
          return res.status(400).json({ error: 'pageBackgroundOpacity must be a number' });
        }
        updateData.pageBackgroundOpacity = Math.min(100, Math.max(0, Math.round(bgOpacity)));
      }
      if (servicesHeadline !== undefined) updateData.servicesHeadline = servicesHeadline;
      if (servicesDescription !== undefined) updateData.servicesDescription = servicesDescription;
      if (aboutHeading !== undefined) updateData.aboutHeading = aboutHeading;
      if (testimonialText !== undefined) updateData.testimonialText = testimonialText;
      if (testimonialAuthor !== undefined) updateData.testimonialAuthor = testimonialAuthor;
      if (testimonialAuthorRole !== undefined) updateData.testimonialAuthorRole = testimonialAuthorRole;
      if (galleryImages !== undefined) updateData.galleryImages = galleryImages;
      if (deliveryNote !== undefined) updateData.deliveryNote = deliveryNote;
      if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
      if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
      if (pageTitle !== undefined) updateData.pageTitle = pageTitle;
      if (pageDescription !== undefined) updateData.pageDescription = pageDescription;
      if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
      if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
      if (tiktokUrl !== undefined) updateData.tiktokUrl = tiktokUrl;
      if (address !== undefined) updateData.address = address;

      const store = await prisma.store.update({
        where: { slug },
        include: {
          products: { orderBy: { createdAt: 'asc' } },
          services: { orderBy: { createdAt: 'asc' } },
          testimonials: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        },
        data: updateData,
      });

      const { password: _password2, ...safeStore } = store;
      res.json(safeStore);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ error: "Failed to update store" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
