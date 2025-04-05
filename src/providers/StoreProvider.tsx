'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

// Define the state shape
interface StoreContextType {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// Create the context with default values
const StoreContext = createContext<StoreContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

// Custom hook to access the store
export const useStore = () => useContext(StoreContext);

// Provider component
export default function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <StoreContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </StoreContext.Provider>
  );
} 