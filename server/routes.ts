import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { products } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.products.list.path, async (req, res) => {
    try {
      const productsList = await storage.getProducts();
      res.json(productsList);
    } catch (err) {
      console.warn("Failed to fetch products:", err && err.message ? err.message : err);
      res.status(503).json([]);
    }
  });

  app.post(api.subscribers.create.path, async (req, res) => {
    try {
      const input = api.subscribers.create.input.parse(req.body);
      const existing = await storage.getSubscriberByEmail(input.email);
      if (existing) {
        return res.status(409).json({ message: "Email already subscribed" });
      }
      const subscriber = await storage.createSubscriber(input);
      res.status(201).json(subscriber);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Attempt to seed the database, but don't crash the server if DB is unavailable.
  if (process.env.SKIP_DB === "1") {
    console.warn("SKIP_DB=1 — skipping database seeding and initial queries.");
  } else {
    try {
      await seedDatabase();
    } catch (err) {
      console.warn("Database seed failed — continuing without DB. Error:", err && err.message ? err.message : err);
    }
  }

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const seedProducts = [
      {
        name: "Minimalist Watch",
        description: "A clean, modern timepiece for everyday wear.",
        price: 12999,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
        category: "Accessories"
      },
      {
        name: "Leather Backpack",
        description: "Handcrafted leather backpack with padded laptop compartment.",
        price: 8999,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000",
        category: "Bags"
      },
      {
        name: "Wireless Headphones",
        description: "Premium noise-cancelling headphones with 30-hour battery life.",
        price: 24999,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
        category: "Electronics"
      },
      {
        name: "Smart Speaker",
        description: "Voice-controlled smart speaker with high-fidelity sound.",
        price: 7999,
        imageUrl: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80&w=1000",
        category: "Electronics"
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes with responsive cushioning.",
        price: 11999,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
        category: "Footwear"
      },
       {
        name: "Classic Sunglasses",
        description: "Timeless aviator style sunglasses with UV protection.",
        price: 14999,
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000",
        category: "Accessories"
      }
    ];

    await db.insert(products).values(seedProducts);
  }
}
