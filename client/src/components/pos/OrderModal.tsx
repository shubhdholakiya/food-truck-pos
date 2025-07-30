import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import MenuGrid from "./MenuGrid";
import OrderSummary from "./OrderSummary";
import type { OrderCart, CartItem } from "@/types";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [cart, setCart] = useState<OrderCart>({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        cartItem => cartItem.menuItemId === item.menuItemId
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += item.quantity;
      } else {
        newItems = [...prevCart.items, item];
      }

      const subtotal = newItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0);
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;

      return {
        ...prevCart,
        items: newItems,
        subtotal,
        tax,
        total,
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );

      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      return {
        ...prevCart,
        items: newItems,
        subtotal,
        tax,
        total,
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      return {
        ...prevCart,
        items: newItems,
        subtotal,
        tax,
        total,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden p-0">
        <div className="flex h-[80vh]">
          {/* Menu Items */}
          <div className="flex-1 p-6 overflow-y-auto">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-medium text-gray-900">
                  New Order
                </DialogTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>
            
            <MenuGrid onAddToCart={addToCart} />
          </div>

          {/* Order Summary */}
          <div className="w-80 bg-surface-variant border-l border-gray-200">
            <OrderSummary 
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onClose={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
