import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import { sendBookingConfirmation, sendAdminNotification, sendPasswordResetEmail } from "./api/_lib/email";
import { hashPassword, verifyStoreAccess, verifyMasterAccess } from "./api/_lib/auth";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Submit a lead (Deep Cleaning / Pressure Cleaning)
  app.post("/api/leads", async (req, res) => {
    try {
      const { customerName, customerEmail, customerPhone, location, requestedDate, storeSlug, notes } = req.body;

      const store = await prisma.store.findUnique({
        where: { slug: storeSlug }
      });

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }

      const lead = await prisma.lead.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          location,
          requestedDate: requestedDate ? new Date(requestedDate) : null,
          notes: notes || null,
          storeId: store.id,
          status: "NEW"
        }
      });

      // Send confirmation email to customer
      await sendBookingConfirmation({
        customerName,
        customerEmail,
        customerPhone,
        location,
        requestedDate,
        storeSlug,
        storeName: store.name,
        notes,
      });

      // Send admin notification
      await sendAdminNotification({
        customerName,
        customerEmail,
        customerPhone,
        location,
        requestedDate,
        storeSlug,
        storeName: store.name,
        notes,
      });

      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
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
      if (!store.contactEmail) {
        return res.status(400).json({ error: 'This unit does not have a configured contact email. Please contact the system administrator.' });
      }

      // Generate a secure 8-character temporary password
      const tempPassword = crypto.randomBytes(4).toString('hex');
      await prisma.store.update({ where: { slug: storeSlug }, data: { password: hashPassword(tempPassword) } });

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

      const email = store.contactEmail;
      const [localPart, domain] = email.split('@');
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

  // Get store details (public — password is stripped from the response)
  app.get("/api/stores/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const store = await prisma.store.findUnique({
        where: { slug },
        include: { products: { orderBy: { createdAt: 'asc' } }, services: { orderBy: { createdAt: 'asc' } } },
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
        include: { products: { orderBy: { createdAt: 'asc' } }, services: { orderBy: { createdAt: 'asc' } } },
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
