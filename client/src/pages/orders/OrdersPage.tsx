import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingCart, Clock } from 'lucide-react';
import { useRecentOrders, useCreateOrder } from '@/api/orders';
import { useCategories, useItems } from '@/api/menu';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import PosMenu from '../orders/PosMenu';
import PosCart from '../orders/PosCart';

function OrdersContent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: recentOrders = [], isLoading } = useRecentOrders(10);
  const createOrderMutation = useCreateOrder();
  const { state: cartState, clearCart } = useCart();

  const handlePlaceOrder = async () => {
    if (cartState.items.length === 0) return;

    const orderData = {
      order: {
        subtotal: cartState.subtotal,
        tax: cartState.tax,
        total: cartState.total,
        paymentMethod: 'cash',
        orderType: 'counter',
      },
      items: cartState.items.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
        specialInstructions: item.specialInstructions || '',
      })),
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
      clearCart();
      setDrawerOpen(false);
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'preparing':
        return 'default';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof value === 'string' ? parseFloat(value) : value);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage orders and process payments.
          </p>
        </div>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button size="lg" className="relative">
              <Plus className="mr-2 h-4 w-4" />
              New Order
              {cartState.items.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {cartState.items.length}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>New Order</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 h-full overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                <div className="lg:col-span-2 overflow-y-auto">
                  <PosMenu />
                </div>
                <div className="lg:col-span-1 overflow-y-auto">
                  <PosCart onPlaceOrder={handlePlaceOrder} />
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent orders found
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{order.orderNumber}</span>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    {order.customerName && (
                      <p className="text-sm text-muted-foreground">
                        {order.customerName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatTime(order.createdAt)} • {order.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.orderType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <CartProvider>
      <OrdersContent />
    </CartProvider>
  );
}