import { createContext, useContext, useReducer, ReactNode } from 'react';
import { MenuItem } from '@/api/menu';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers?: Array<{
    id: string;
    name: string;
    priceDelta: number;
  }>;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_INSTRUCTIONS'; payload: { id: string; instructions: string } }
  | { type: 'CLEAR_CART' };

const TAX_RATE = 0.0875; // 8.75%

function calculateTotals(items: CartItem[]): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];
  
  switch (action.type) {
    case 'ADD_ITEM':
      const newId = Math.random().toString(36).substr(2, 9);
      newItems = [...state.items, { ...action.payload, id: newId }];
      return { ...state, items: newItems, ...calculateTotals(newItems) };
      
    case 'UPDATE_QUANTITY':
      newItems = state.items.map(item => 
        item.id === action.payload.id 
          ? { 
              ...item, 
              quantity: action.payload.quantity,
              totalPrice: item.unitPrice * action.payload.quantity
            }
          : item
      ).filter(item => item.quantity > 0);
      return { ...state, items: newItems, ...calculateTotals(newItems) };
      
    case 'REMOVE_ITEM':
      newItems = state.items.filter(item => item.id !== action.payload.id);
      return { ...state, items: newItems, ...calculateTotals(newItems) };
      
    case 'UPDATE_INSTRUCTIONS':
      newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, specialInstructions: action.payload.instructions }
          : item
      );
      return { ...state, items: newItems };
      
    case 'CLEAR_CART':
      return { items: [], subtotal: 0, tax: 0, total: 0 };
      
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  updateInstructions: (id: string, instructions: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateInstructions = (id: string, instructions: string) => {
    dispatch({ type: 'UPDATE_INSTRUCTIONS', payload: { id, instructions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateQuantity,
        removeItem,
        updateInstructions,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}