import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useCategories, useItems, type MenuItem } from '@/api/menu';
import { useCreateCustomerOrder } from '@/api/orders';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

function QrOrderContent({ tableId }: { tableId: string }) {
  const [step, setStep] = useState<'menu' | 'checkout' | 'confirmation'>('menu');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
  });
  const [orderNumber, setOrderNumber] = useState<string>('');

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allItems = [], isLoading: itemsLoading } = useItems();
  const createOrderMutation = useCreateCustomerOrder();
  const { state, addItem, updateQuantity, removeItem } = useCart();

  const filteredAvailableItems = allItems.filter(item => item.isAvailable);

  const handleAddToCart = (menuItem: MenuItem) => {
    const price = parseFloat(menuItem.price);
    addItem({
      menuItem,
      quantity: 1,
      unitPrice: price,
      totalPrice: price,
    });
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    const orderData = {
      order: {
        customerName: customerInfo.name || 'Guest',
        subtotal: state.subtotal,
        tax: state.tax,
        total: state.total,
        paymentMethod: 'cash',
        orderType: 'customer-online',
        notes: `Table: ${tableId}`,
      },
      items: state.items.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        price: item.totalPrice.toString(),
        notes: item.specialInstructions || '',
      })),
    };

    try {
      const result = await createOrderMutation.mutateAsync(orderData);
      setOrderNumber(result.orderNumber);
      setStep('confirmation');
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getItemsByCategory = (categoryId: string) => {
    return filteredAvailableItems.filter(item => item.categoryId === categoryId);
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-lg font-semibold">Order #{orderNumber}</p>
              <p className="text-sm text-muted-foreground">Table {tableId}</p>
            </div>
            <p className="text-muted-foreground">
              Your order has been sent to the kitchen. Please pay at the counter when ready.
            </p>
            <div className="text-lg font-semibold">
              Total: {formatCurrency(state.total)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Table {tableId}</h1>
            <p className="text-muted-foreground">Browse our menu and place your order</p>
          </div>
          {state.items.length > 0 && (
            <Button
              onClick={() => setStep('checkout')}
              className="relative"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Cart
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
              >
                {state.items.length}
              </Badge>
            </Button>
          )}
        </div>

        {step === 'menu' && (
          <Tabs defaultValue={categories[0]?.id} className="space-y-4">
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.filter(cat => cat.isActive).map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.filter(cat => cat.isActive).map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getItemsByCategory(category.id).map((item) => {
                    const cartItem = state.items.find(ci => ci.menuItem.id === item.id);
                    return (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              {item.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-lg font-semibold text-primary">
                                {formatCurrency(parseFloat(item.price))}
                              </p>
                            </div>
                            
                            {cartItem ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="font-medium w-8 text-center">
                                    {cartItem.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Badge variant="secondary">
                                  {formatCurrency(cartItem.totalPrice)}
                                </Badge>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleAddToCart(item)}
                                className="w-full"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {step === 'checkout' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span>{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(state.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency(state.tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(state.total)}</span>
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <Button
                    onClick={handleCheckout}
                    disabled={createOrderMutation.isPending || state.items.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order (Pay at Counter)'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep('menu')}
                    className="w-full"
                  >
                    Back to Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QrOrderPage() {
  const [match, params] = useRoute('/qr/:tableId');
  
  if (!match || !params?.tableId) {
    return <div>Invalid table ID</div>;
  }

  return (
    <CartProvider>
      <QrOrderContent tableId={params.tableId} />
    </CartProvider>
  );
}