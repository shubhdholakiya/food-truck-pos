import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertCategorySchema,
  insertMenuItemSchema,
  insertCustomerSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertInventoryItemSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);
  function getUserId(req: any) {
  // if auth is disabled locally, fall back to a stable dev id
  return req?.user?.claims?.sub || process.env.DEV_USER_ID || 'dev-user';
}

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);

    // In local dev there may be no user in storage—return a mock
    const user = (await storage.getUser(userId).catch(() => null)) || {
      id: userId,
      name: 'Dev User',
      email: 'dev@example.com',
    };

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: "Failed to create category" });
    }
  });

  app.get('/api/menu-items', async (req, res) => {
    try {
      const { categoryId } = req.query;
      const menuItems = categoryId
        ? await storage.getMenuItemsByCategory(categoryId as string)
        : await storage.getMenuItems();
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post('/api/menu-items', isAuthenticated, async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(menuItem);
    } catch (error) {
      console.error("Error creating menu item:", error);
      res.status(400).json({ message: "Failed to create menu item" });
    }
  });

  app.put('/api/menu-items/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const menuItemData = insertMenuItemSchema.partial().parse(req.body);
      const menuItem = await storage.updateMenuItem(id, menuItemData);
      res.json(menuItem);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(400).json({ message: "Failed to update menu item" });
    }
  });

  app.get('/api/customers', isAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(400).json({ message: "Failed to create customer" });
    }
  });

  app.get('/api/customers/search', isAuthenticated, async (req, res) => {
    try {
      const { email, phone } = req.query;
      const customer = email
        ? await storage.getCustomerByEmail(email as string)
        : phone
        ? await storage.getCustomerByPhone(phone as string)
        : null;
      res.json(customer || null);
    } catch (error) {
      console.error("Error searching customer:", error);
      res.status(500).json({ message: "Failed to search customer" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const { order, items } = createOrderSchema.parse(req.body);

    const newOrder = await storage.createOrder({ ...order, userId }, items);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: "Failed to create order" });
  }
});


  app.get('/api/orders/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrderWithItems(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const createOrderSchema = z.object({
    order: insertOrderSchema,
    items: z.array(insertOrderItemSchema),
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { order, items } = createOrderSchema.parse(req.body);
      const newOrder = await storage.createOrder({ ...order, userId }, items);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: "Failed to create order" });
    }
  });

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
    items: z.array(z.object({
      menuItemId: z.string(),
      quantity: z.number(),
      price: z.number(),
      notes: z.string().nullable().optional(),
    })),
  });

  app.post('/api/customer-orders', async (req, res) => {
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
      const transformedItems = items.map((item: any) => ({
        quantity: item.quantity,
        unitPrice: item.price.toString(),
        totalPrice: (item.price * item.quantity).toString(),
        menuItemId: item.menuItemId,
        specialInstructions: item.notes || ""
      }));
      const newOrder = await storage.createOrder(orderData, transformedItems);

      // const newOrder = await storage.createOrder(orderData, items);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating customer order:", error);
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  app.put('/api/orders/:id/status', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) return res.status(400).json({ message: "Status is required" });
      const order = await storage.updateOrderStatus(id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(400).json({ message: "Failed to update order status" });
    }
  });

  app.get('/api/inventory', isAuthenticated, async (req, res) => {
    try {
      const { lowStock } = req.query;
      const items = lowStock === 'true'
        ? await storage.getLowStockItems()
        : await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post('/api/inventory', isAuthenticated, async (req, res) => {
    try {
      const inventoryData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(inventoryData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating inventory item:", error);
      res.status(400).json({ message: "Failed to create inventory item" });
    }
  });

  app.put('/api/inventory/:id/stock', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      if (typeof quantity !== 'number') return res.status(400).json({ message: "Quantity must be a number" });
      const item = await storage.updateInventoryStock(id, quantity);
      res.json(item);
    } catch (error) {
      console.error("Error updating inventory stock:", error);
      res.status(400).json({ message: "Failed to update inventory stock" });
    }
  });
  app.get('/api/login', (req: any, res) => {
  // When SKIP_REPLIT_AUTH=true we aren't doing real auth; just return OK
  if (process.env.SKIP_REPLIT_AUTH === 'true') {
    // You can also set a cookie here if your app expects it.
    return res.json({ ok: true, message: 'Local dev: auth skipped', user: { id: 'dev-user' } });
  }
  // In prod, Replit auth handles login
  res.status(404).send('Login is handled by Replit in production.');
});


  app.get('/api/analytics/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getSalesMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching sales metrics:", error);
      res.status(500).json({ message: "Failed to fetch sales metrics" });
    }
  });

  app.get('/api/analytics/top-items', isAuthenticated, async (req, res) => {
    try {
      const { limit } = req.query;
      const topItems = await storage.getTopSellingItems(parseInt(limit as string) || 5);
      res.json(topItems);
    } catch (error) {
      console.error("Error fetching top selling items:", error);
      res.status(500).json({ message: "Failed to fetch top selling items" });
    }
  });

  app.get('/api/analytics/daily-sales', isAuthenticated, async (req, res) => {
    try {
      const { date } = req.query;
      const targetDate = date ? new Date(date as string) : new Date();
      const dailySales = await storage.getDailySales(targetDate);
      res.json(dailySales);
    } catch (error) {
      console.error("Error fetching daily sales:", error);
      res.status(500).json({ message: "Failed to fetch daily sales" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

