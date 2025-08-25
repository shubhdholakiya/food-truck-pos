import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Types
export type OrderSummary = {
  id: string;
  orderNumber: string;
  customerName?: string;
  subtotal: string;
  tax: string;
  total: string;
  status: string;
  paymentMethod: string;
  orderType: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  specialInstructions?: string;
  createdAt: string;
};

export type NewOrderPayload = {
  order: {
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    orderType: string;
    notes?: string;
  };
  items: Array<{
    menuItemId: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    specialInstructions?: string;
  }>;
};

export type CustomerOrderPayload = {
  order: {
    customerName: string;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    orderType: string;
    notes?: string;
  };
  items: Array<{
    menuItemId: string;
    quantity: number;
    price: string;
    notes?: string;
  }>;
};

// Recent Orders
export const useRecentOrders = (n: number = 5) => {
  return useQuery({
    queryKey: ['/api/orders', { recent: n }],
    queryFn: () => get<OrderSummary[]>(`/api/orders?recent=${n}`),
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });
};

// Single Order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['/api/orders', id],
    queryFn: () => get<OrderSummary>(`/api/orders/${id}`),
    enabled: !!id,
  });
};

// Create Order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: NewOrderPayload) => 
      post<OrderSummary>('/api/orders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({ title: "Order placed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error placing order", description: error.message, variant: "destructive" });
    },
  });
};

// Update Order Status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      put<OrderSummary>(`/api/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({ title: "Order status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating order status", description: error.message, variant: "destructive" });
    },
  });
};

// Create Customer Order (public)
export const useCreateCustomerOrder = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: CustomerOrderPayload) => 
      post<{ id: string; orderNumber: string }>('/api/customer-orders', data),
    onSuccess: () => {
      toast({ title: "Order placed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error placing order", description: error.message, variant: "destructive" });
    },
  });
};