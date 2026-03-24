import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/CartItem';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'subtotal'>) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity' | 'subtotal'>) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.bookId === item.bookId);
      if (existing) {
        return prev.map((i) =>
          i.bookId === item.bookId
            ? {
                ...i,
                quantity: i.quantity + 1,
                subtotal: parseFloat(((i.quantity + 1) * i.price).toFixed(2)),
              }
            : i
        );
      }
      return [
        ...prev,
        { ...item, quantity: 1, subtotal: parseFloat(item.price.toFixed(2)) },
      ];
    });
  };

  const removeFromCart = (bookId: number) => {
    setCartItems((prev) => prev.filter((i) => i.bookId !== bookId));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = parseFloat(
    cartItems.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2)
  );
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
