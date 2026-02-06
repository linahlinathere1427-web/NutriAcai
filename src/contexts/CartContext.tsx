import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantPhone?: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  calories?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  currency: string;
  setCurrency: (currency: string) => void;
  currencySymbol: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "AED ",
  SAR: "SAR ",
  INR: "₹",
  PKR: "Rs ",
  EGP: "EGP ",
  QAR: "QAR ",
  KWD: "KWD ",
  BHD: "BHD ",
  OMR: "OMR ",
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState("AED");

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("nutriacai_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
    
    const savedCurrency = localStorage.getItem("nutriacai_currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("nutriacai_cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("nutriacai_currency", currency);
  }, [currency]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === item.id && i.restaurantId === item.restaurantId);
      if (existing) {
        return current.map((i) =>
          i.id === item.id && i.restaurantId === item.restaurantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((current) => current.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((current) =>
      current.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currencySymbol = currencySymbols[currency] || currency + " ";

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        currency,
        setCurrency,
        currencySymbol,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
