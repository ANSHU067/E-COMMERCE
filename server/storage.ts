import { products, subscribers, type Product, type InsertProduct, type Subscriber, type InsertSubscriber } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Minimalist Watch",
    description: "A clean, modern timepiece for everyday wear.",
    price: 12999,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    category: "Accessories"
  },
  {
    id: 2,
    name: "Leather Backpack",
    description: "Handcrafted leather backpack with padded laptop compartment.",
    price: 8999,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000",
    category: "Bags"
  },
  {
    id: 3,
    name: "Wireless Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life.",
    price: 24999,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    category: "Electronics"
  },
  {
    id: 4,
    name: "Smart Speaker",
    description: "Voice-controlled smart speaker with high-fidelity sound.",
    price: 7999,
    imageUrl: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80&w=1000",
    category: "Electronics"
  },
  {
    id: 5,
    name: "Running Shoes",
    description: "Lightweight running shoes with responsive cushioning.",
    price: 11999,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
    category: "Footwear"
  },
  {
    id: 6,
    name: "Classic Sunglasses",
    description: "Timeless aviator style sunglasses with UV protection.",
    price: 14999,
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000",
    category: "Accessories"
  }
];

export interface IStorage {
  getProducts(): Promise<Product[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    try {
      return await db.select().from(products);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn("Database unavailable, returning default products:", errorMessage);
      return DEFAULT_PRODUCTS;
    }
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    try {
      const [subscriber] = await db.insert(subscribers).values(insertSubscriber).returning();
      return subscriber;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn("Database unavailable, cannot create subscriber:", errorMessage);
      throw new Error("Unable to subscribe at this time. Please try again later.");
    }
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    try {
      const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
      return subscriber;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn("Database unavailable, cannot check subscriber:", errorMessage);
      // Return undefined when DB is unavailable - will allow subscription attempt
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();
