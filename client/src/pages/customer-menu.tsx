import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, ShoppingCart, Store, Phone, Mail } from "lucide-react";
import type { MenuItem, Category } from "@shared/schema";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface CustomerInfo {
  name: string;
  email?: string;
  phone?: string;
}

export default function CustomerMenu() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: "" });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [orderNotes, setOrderNotes] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: selectedCategory === "all" 
      ? ["/api/menu-items"] 
      : [`/api/menu-items?categoryId=${selectedCategory}`],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/customer-orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully!",
        description: paymentMethod === "cash" 
          ? "Please pay at the counter when your order is ready"
          : "Payment processed. Your order is being prepared",
      });
      setCart([]);
      setShowCheckout(false);
      setCustomerInfo({ name: "" });
      setOrderNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
      }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    if (!customerInfo.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name for the order",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      order: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email || null,
        customerPhone: customerInfo.phone || null,
        subtotal,
        tax,
        total,
        paymentMethod,
        status: "pending",
        notes: orderNotes || null,
        orderType: "customer-online"
      },
      items: cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        notes: item.notes || null,
      }))
    };

    createOrderMutation.mutate(orderData);
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-primary text-white p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Store className="h-8 w-8" />
              <h1 className="text-2xl font-bold">FoodTruck POS</h1>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setShowCheckout(false)}
            >
              Back to Menu
            </Button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="space-y-3">
                <h3 className="font-medium">Order Summary</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-medium">Your Information</h3>
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name for the order"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email || ""}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone || ""}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-medium">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={(value: "cash" | "card") => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Pay Cash at Counter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Pay Now with Card</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (optional)</Label>
                <Textarea
                  id="notes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special requests or dietary restrictions..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                size="lg"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending 
                  ? "Placing Order..." 
                  : `Place Order - $${total.toFixed(2)}`
                }
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8" />
            <h1 className="text-2xl font-bold">FoodTruck POS</h1>
          </div>
          {cart.length > 0 && (
            <Button
              onClick={() => setShowCheckout(true)}
              className="bg-white text-primary hover:bg-gray-100"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              <Badge className="ml-2 bg-primary text-white">
                ${total.toFixed(2)}
              </Badge>
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h2>
          <p className="text-gray-600">Fresh, delicious food made to order</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            All Items
          </Button>
          {(categories as any[]).map((category: any) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-32 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-4" />
                  <div className="h-8 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(menuItems as any[]).map((item: any) => {
              const cartItem = cart.find(c => c.id === item.id);
              return (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Store className="h-12 w-12" />
                      </div>
                    )}
                    {item.isSpecial && (
                      <Badge className="absolute top-2 right-2 bg-accent text-white">
                        Special
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description || "Delicious and fresh"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                      
                      {cartItem ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Badge variant="secondary" className="w-8 justify-center">
                            {cartItem.quantity}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => addToCart(item)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Contact Info */}
        <Card className="mt-12">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Visit Us</h3>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-FOOD</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@foodtruckpos.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Cart Button for Mobile */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 md:hidden">
          <Button
            onClick={() => setShowCheckout(true)}
            className="rounded-full h-14 w-14 shadow-lg"
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 bg-accent text-white min-w-[1.5rem] h-6">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  );
}