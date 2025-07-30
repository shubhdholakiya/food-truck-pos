export interface OrderCart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerId?: string;
  notes?: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  imageUrl?: string;
}

export interface SalesMetrics {
  todaySales: number;
  totalOrders: number;
  avgOrder: number;
  lowStockCount: number;
}

export interface TopSellingItem {
  id: string;
  name: string;
  soldCount: number;
  revenue: number;
  imageUrl?: string;
}

export interface OrderWithItems {
  id: string;
  orderNumber: string;
  customerId?: string;
  userId: string;
  status: string;
  orderType: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    specialInstructions?: string;
    menuItem: {
      id: string;
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
    };
  }[];
}
