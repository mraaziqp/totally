import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

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
      const { customerName, customerEmail, customerPhone, location, requestedDate, storeSlug } = req.body;

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
          storeId: store.id,
          status: "NEW"
        }
      });

      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  // Admin: Get all leads
  app.get("/api/admin/leads", async (req, res) => {
    try {
      const { storeSlug } = req.query;
      
      const queryOptions: any = {
        orderBy: { createdAt: 'desc' }
      };

      if (storeSlug) {
        const store = await prisma.store.findUnique({
          where: { slug: storeSlug as string }
        });
        if (store) {
          queryOptions.where = { storeId: store.id };
        }
      }

      const leads = await prisma.lead.findMany(queryOptions);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Get store details
  app.get("/api/stores/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const store = await prisma.store.findUnique({
        where: { slug }
      });
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ error: "Failed to fetch store" });
    }
  });

  // Update store details (CMS)
  app.patch("/api/stores/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { 
        heroHeadline, 
        tagline,
        missionText, 
        aboutUsText, 
        heroImageUrl,
        servicesHeading,
        aboutHeading,
        testimonialText,
        testimonialAuthor,
        testimonialAuthorRole
      } = req.body;
      
      const store = await prisma.store.update({
        where: { slug },
        data: {
          heroHeadline,
          tagline,
          missionText,
          aboutUsText,
          heroImageUrl,
          servicesHeading,
          aboutHeading,
          testimonialText,
          testimonialAuthor,
          testimonialAuthorRole
        }
      });
      
      res.json(store);
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
