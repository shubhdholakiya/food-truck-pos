import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

import {
  insertCategorySchema,
  insertMenuItemSchema,
  insertCustomerSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertInventoryItemSchema,
} from "../shared/schema";

import menuRoutes from "./menu.routes"; 

/** ---------- helpers ---------- */
function getUserId(req: any) {
  // if auth is disabled locally, fall back to a stable dev id
  return req?.user?.claims?.sub || process.env.DEV_USER_ID || "dev-user";
}

const createOrderSchema = z.object({
  order: insertOrderSchema,
  items: z.array(insertOrderItemSchema),
});

const iso = () => new Date().toISOString();

/**
 * Seed some dev data using your existing storage helpers.
 * Idempotent-ish: it tries to create, then falls back to finding by name if present.
 */
async function seedDevData(store: any) {
  // Categories
  const catBurgers =
    (await store.createCategory({ name: "Burgers", description: "House burgers" }).catch(() => null)) ||
    (await store.getCategories().then((rows: any[]) => rows.find((c) => c.name === "Burgers")));

  const catDrinks =
    (await store.createCategory({ name: "Drinks", description: "Cold drinks" }).catch(() => null)) ||
    (await store.getCategories().then((rows: any[]) => rows.find((c) => c.name === "Drinks")));

  // Menu items
  const burger =
    (await store
      .createMenuItem({
        name: "Classic Burger",
        description: "Beef patty, cheese, lettuce",
        price: 8.5,
        categoryId: catBurgers?.id ?? catBurgers,
        isAvailable: true,
      })
      .catch(() => null)) ||
    (await store.getMenuItems().then((rows: any[]) => rows.find((m) => m.name === "Classic Burger")));

  const fries =
    (await store
      .createMenuItem({
        name: "Fries",
        description: "Crispy fries",
        price: 3.0,
        categoryId: catBurgers?.id ?? catBurgers,
        isAvailable: true,
      })
      .catch(() => null)) ||
    (await store.getMenuItems().then((rows: any[]) => rows.find((m) => m.name === "Fries")));

  const cola =
    (await store
      .createMenuItem({
        name: "Cola",
        description: "Cold drink",
        price: 2.0,
        categoryId: catDrinks?.id ?? catDrinks,
        isAvailable: true,
      })
      .catch(() => null)) ||
    (await store.getMenuItems().then((rows: any[]) => rows.find((m) => m.name === "Cola")));

  // One example order with items
  const orderNumber = `DEV-${Date.now().toString().slice(-6)}`;
  const order = await store
    .createOrder(
      {
        orderNumber,
        userId: "dev-user",
        customerName: "Walk‑in",
        customerEmail: null,
        customerPhone: null,
        subtotal: "13.50",
        tax: "1.22",
        total: "14.72",
        paymentMethod: "cash",
        status: "preparing",
        notes: "",
        orderType: "counter",
        createdAt: iso(),
        updatedAt: iso(),
      },
      [
        { menuItemId: burger?.id ?? burger, quantity: 1, unitPrice: "8.50", totalPrice: "8.50", specialInstructions: "" },
        { menuItemId: fries?.id ?? fries, quantity: 1, unitPrice: "3.00", totalPrice: "3.00", specialInstructions: "" },
        { menuItemId: cola?.id ?? cola, quantity: 1, unitPrice: "2.00", totalPrice: "2.00", specialInstructions: "No ice" },
      ]
    )
    .catch(() => null);

  return { catBurgers, catDrinks, burger, fries, cola, order };
}

/** ---------- routes ---------- */
export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  /** Dev seed (GET and POST for convenience) */
  app.post("/api/dev/seed", async (_req, res) => {
    try {
      const seeded = await seedDevData(storage);
      res.json({ ok: true, seeded });
    } catch (err) {
      console.error("Dev seed failed:", err);
      res.status(500).json({ message: "Dev seed failed" });
    }
  });

  app.use("/api/menu", menuRoutes); 

  app.get("/api/dev/seed", async (_req, res) => {
    try {
      const seeded = await seedDevData(storage);
      res.json({ ok: true, seeded });
    } catch (err) {
      console.error("Dev seed failed:", err);
      res.status(500).json({ message: "Dev seed failed" });
    }
  });

  /** Auth user (dev-friendly) */
  app.get("/api/auth/user", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
      const user =
        (await storage.getUser(userId).catch(() => null)) || {
          id: userId,
          name: "Dev User",
          email: "dev@example.com",
        };
      res.json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  /** Categories */
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", isAuthenticated, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (err) {
      console.error("Error creating category:", err);
      res.status(400).json({ message: "Failed to create category" });
    }
  });

  /** Menu items */
  app.get("/api/menu-items", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const menuItems = categoryId
        ? await storage.getMenuItemsByCategory(String(categoryId))
        : await storage.getMenuItems();
      res.json(menuItems);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post("/api/menu-items", isAuthenticated, async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(menuItem);
    } catch (err) {
      console.error("Error creating menu item:", err);
      res.status(400).json({ message: "Failed to create menu item" });
    }
  });

  app.put("/api/menu-items/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const menuItemData = insertMenuItemSchema.partial().parse(req.body);
      const menuItem = await storage.updateMenuItem(id, menuItemData);
      res.json(menuItem);
    } catch (err) {
      console.error("Error updating menu item:", err);
      res.status(400).json({ message: "Failed to update menu item" });
    }
  });

  /** Customers */
  app.get("/api/customers", isAuthenticated, async (_req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (err) {
      console.error("Error fetching customers:", err);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", isAuthenticated, async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (err) {
      console.error("Error creating customer:", err);
      res.status(400).json({ message: "Failed to create customer" });
    }
  });

  app.get("/api/customers/search", isAuthenticated, async (req, res) => {
    try {
      const { email, phone } = req.query as { email?: string; phone?: string };
      const customer = email
        ? await storage.getCustomerByEmail(email)
        : phone
        ? await storage.getCustomerByPhone(phone)
        : null;
      res.json(customer || null);
    } catch (err) {
      console.error("Error searching customer:", err);
      res.status(500).json({ message: "Failed to search customer" });
    }
  });

  /** ---------- Orders ---------- */

  // List endpoint used by the UI: /api/orders?recent=5
  app.get("/api/orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const recent = Number(req.query.recent ?? 0);

      if (typeof (storage as any).getRecentOrders === "function") {
        const rows = await (storage as any).getRecentOrders(recent > 0 ? recent : undefined);
        return res.json(rows ?? []);
      }

      if (typeof (storage as any).getOrders === "function") {
        const all = await (storage as any).getOrders();
        const sorted = Array.isArray(all)
          ? [...all].sort(
              (a: any, b: any) =>
                new Date(b.createdAt ?? b.created_at ?? 0).getTime() -
                new Date(a.createdAt ?? a.created_at ?? 0).getTime()
            )
          : [];
        return res.json(recent > 0 ? sorted.slice(0, recent) : sorted);
      }

      return res.json([]); // safe fallback so UI doesn’t 404
    } catch (err) {
      console.error("Error listing orders:", err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // create
  app.post("/api/orders", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
      const { order, items } = createOrderSchema.parse(req.body);
      const newOrder = await storage.createOrder({ ...order, userId }, items);
      res.status(201).json(newOrder);
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  // read
  app.get("/api/orders/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrderWithItems(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (err) {
      console.error("Error fetching order:", err);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // update status
  app.put("/api/orders/:id/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status?: string };
      if (!status) return res.status(400).json({ message: "Status is required" });
      const order = await storage.updateOrderStatus(id, status);
      res.json(order);
    } catch (err) {
      console.error("Error updating order status:", err);
      res.status(400).json({ message: "Failed to update order status" });
    }
  });

  /** Public customer order (no auth) */
  const createCustomerOrderSchema = z.object({
    order: z.object({
      customerName: z.string(),
      customerEmail: z.string().nullable().optional(),
      customerPhone: z.string().nullable().optional(),
      subtotal: z.number(),
      tax: z.number(),
      total: z.number(),
      paymentMethod: z.enum(["cash", "card"]),
      status: z.string().default("pending"),
      notes: z.string().nullable().optional(),
      orderType: z.string().default("customer-online"),
    }),
    items: z.array(
      z.object({
        menuItemId: z.string(),
        quantity: z.number(),
        price: z.number(),
        notes: z.string().nullable().optional(),
      })
    ),
  });

  app.post("/api/customer-orders", async (req: Request, res: Response) => {
    try {
      const { order, items } = createCustomerOrderSchema.parse(req.body);
      const orderNumber = `WEB-${Date.now().toString().slice(-6)}`;

      const orderData = {
        ...order,
        orderNumber,
        userId: null,
        subtotal: order.subtotal.toString(),
        tax: order.tax.toString(),
        total: order.total.toString(),
      };

      const transformedItems = items.map((it) => ({
        quantity: it.quantity,
        unitPrice: it.price.toString(),
        totalPrice: (it.price * it.quantity).toString(),
        menuItemId: it.menuItemId,
        specialInstructions: it.notes || "",
      }));

      const newOrder = await storage.createOrder(orderData, transformedItems);
      res.status(201).json(newOrder);
    } catch (err) {
      console.error("Error creating customer order:", err);
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  /** Inventory */
  app.get("/api/inventory", isAuthenticated, async (req, res) => {
    try {
      const { lowStock } = req.query;
      const items =
        lowStock === "true" ? await storage.getLowStockItems() : await storage.getInventoryItems();
      res.json(items);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post("/api/inventory", isAuthenticated, async (req, res) => {
    try {
      const inventoryData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(inventoryData);
      res.status(201).json(item);
    } catch (err) {
      console.error("Error creating inventory item:", err);
      res.status(400).json({ message: "Failed to create inventory item" });
    }
  });

  app.put("/api/inventory/:id/stock", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body as { quantity?: number };
    if (typeof quantity !== "number")
        return res.status(400).json({ message: "Quantity must be a number" });
      const item = await storage.updateInventoryStock(id, quantity);
      res.json(item);
    } catch (err) {
      console.error("Error updating inventory stock:", err);
      res.status(400).json({ message: "Failed to update inventory stock" });
    }
  });

  /** Local dev "login" (no-op when SKIP_REPLIT_AUTH=true) */
  app.get("/api/login", (_req: any, res: Response) => {
    if (process.env.SKIP_REPLIT_AUTH === "true") {
      return res.json({ ok: true, message: "Local dev: auth skipped", user: { id: "dev-user" } });
    }
    res.status(404).send("Login is handled by Replit in production.");
  });

  /** Analytics (require auth) */
  app.get("/api/analytics/metrics", isAuthenticated, async (_req, res) => {
    try {
      const metrics = await storage.getSalesMetrics();
      res.json(metrics);
    } catch (err) {
      console.error("Error fetching sales metrics:", err);
      res.status(500).json({ message: "Failed to fetch sales metrics" });
    }
  });

  app.get("/api/analytics/top-items", isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(String(req.query.limit ?? "5"), 10) || 5;
      const topItems = await storage.getTopSellingItems(limit);
      res.json(topItems);
    } catch (err) {
      console.error("Error fetching top selling items:", err);
      res.status(500).json({ message: "Failed to fetch top selling items" });
    }
  });

  app.get("/api/analytics/daily-sales", isAuthenticated, async (req, res) => {
    try {
      const { date } = req.query;
      const targetDate = date ? new Date(String(date)) : new Date();
      const dailySales = await storage.getDailySales(targetDate);
      res.json(dailySales);
    } catch (err) {
      console.error("Error fetching daily sales:", err);
      res.status(500).json({ message: "Failed to fetch daily sales" });
    }
  });

  /** return HTTP server to caller */
  const httpServer = createServer(app);
  return httpServer;
}
