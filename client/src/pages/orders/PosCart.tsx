import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingCart, DollarSign } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface PosCartProps {
  onPlaceOrder: () => Promise<void>;
}

export default function PosCart({ onPlaceOrder }: PosCartProps) {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { state, updateQuantity, removeItem, updateInstructions } = useCart();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      await onPlaceOrder();
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Cart ({state.items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {state.items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-2">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add items from the menu to get started
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {state.items.map((item) => (
                <div key={item.id} className="space-y-3 pb-4 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.menuItem.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Badge variant="secondary">
                      {formatCurrency(item.totalPrice)}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`instructions-${item.id}`} className="text-xs">
                      Special Instructions
                    </Label>
                    <Textarea
                      id={`instructions-${item.id}`}
                      placeholder="Add special instructions..."
                      value={item.specialInstructions || ''}
                      onChange={(e) => updateInstructions(item.id, e.target.value)}
                      className="min-h-[60px] text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(state.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8.75%)</span>
                  <span>{formatCurrency(state.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(state.total)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || state.items.length === 0}
                className="w-full"
                size="lg"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {isPlacingOrder ? 'Placing Order...' : 'Place Order (Cash)'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}