import {
  users,
  categories,
  menuItems,
  customers,
  orders,
  orderItems,
  inventoryItems,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type MenuItem,
  type InsertMenuItem,
  type Customer,
  type InsertCustomer,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type InventoryItem,
  type InsertInventoryItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, gte, lte, like, sql, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Menu item operations
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, menuItem: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: string): Promise<void>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderWithItems(id: string): Promise<(Order & { orderItems: (OrderItem & { menuItem: MenuItem })[] }) | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;

  // Inventory operations
  getInventoryItems(): Promise<InventoryItem[]>;
  getLowStockItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem>;
  updateInventoryStock(id: string, quantity: number): Promise<InventoryItem>;

  // Analytics operations
  getDailySales(date: Date): Promise<{ total: number; orderCount: number; avgOrder: number }>;
  getTopSellingItems(limit?: number): Promise<(MenuItem & { soldCount: number; revenue: number })[]>;
  getSalesMetrics(): Promise<{
    todaySales: number;
    totalOrders: number;
    avgOrder: number;
    lowStockCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  }

  // Menu item operations
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.isAvailable, true)).orderBy(asc(menuItems.sortOrder));
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(and(eq(menuItems.categoryId, categoryId), eq(menuItems.isAvailable, true)))
      .orderBy(asc(menuItems.sortOrder));
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(menuItem).returning();
    return newItem;
  }

  async updateMenuItem(id: string, menuItem: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [updatedItem] = await db
      .update(menuItems)
      .set({ ...menuItem, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteMenuItem(id: string): Promise<void> {
    await db.update(menuItems).set({ isAvailable: false }).where(eq(menuItems.id, id));
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.lastVisit));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.phone, phone));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderWithItems(id: string): Promise<(Order & { orderItems: (OrderItem & { menuItem: MenuItem })[] }) | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;

    const items = await db
      .select({
        orderItem: orderItems,
        menuItem: menuItems,
      })
      .from(orderItems)
      .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .where(eq(orderItems.orderId, id));

    return {
      ...order,
      orderItems: items.map(item => ({
        ...item.orderItem,
        menuItem: item.menuItem,
      })),
    };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const [newOrder] = await db
      .insert(orders)
      .values({ ...order, orderNumber })
      .returning();

    // Insert order items
    if (items.length > 0) {
      await db.insert(orderItems).values(
        items.map(item => ({
          ...item,
          orderId: newOrder.id,
        }))
      );
    }

    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(and(gte(orders.createdAt, startDate), lte(orders.createdAt, endDate)))
      .orderBy(desc(orders.createdAt));
  }

  // Inventory operations
  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).orderBy(asc(inventoryItems.name));
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return await db
      .select()
      .from(inventoryItems)
      .where(sql`${inventoryItems.currentStock} <= ${inventoryItems.minStock}`)
      .orderBy(asc(inventoryItems.name));
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventoryItems).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const [updatedItem] = await db
      .update(inventoryItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem;
  }

  async updateInventoryStock(id: string, quantity: number): Promise<InventoryItem> {
    const [updatedItem] = await db
      .update(inventoryItems)
      .set({ 
        currentStock: sql`${inventoryItems.currentStock} + ${quantity}`,
        updatedAt: new Date() 
      })
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem;
  }

  // Analytics operations
  async getDailySales(date: Date): Promise<{ total: number; orderCount: number; avgOrder: number }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await db
      .select({
        total: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
        orderCount: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, startOfDay),
          lte(orders.createdAt, endOfDay),
          eq(orders.paymentStatus, "paid")
        )
      );

    const { total, orderCount } = result[0];
    const avgOrder = orderCount > 0 ? total / orderCount : 0;

    return { total, orderCount, avgOrder };
  }

  async getTopSellingItems(limit: number = 5): Promise<(MenuItem & { soldCount: number; revenue: number })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        menuItem: menuItems,
        soldCount: sql<number>`SUM(${orderItems.quantity})`,
        revenue: sql<number>`SUM(${orderItems.totalPrice})`,
      })
      .from(orderItems)
      .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          gte(orders.createdAt, today),
          eq(orders.paymentStatus, "paid")
        )
      )
      .groupBy(menuItems.id)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(limit);

    return result.map(item => ({
      ...item.menuItem,
      soldCount: item.soldCount,
      revenue: item.revenue,
    }));
  }

  async getSalesMetrics(): Promise<{
    todaySales: number;
    totalOrders: number;
    avgOrder: number;
    lowStockCount: number;
  }> {
    const today = new Date();
    const dailySales = await this.getDailySales(today);
    const lowStockItems = await this.getLowStockItems();

    return {
      todaySales: dailySales.total,
      totalOrders: dailySales.orderCount,
      avgOrder: dailySales.avgOrder,
      lowStockCount: lowStockItems.length,
    };
  }
}

export const storage = new DatabaseStorage();
