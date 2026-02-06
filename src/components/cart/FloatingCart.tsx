import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { items, totalItems, totalAmount, currencySymbol, updateQuantity, removeItem, clearCart } = useCart();

  if (totalItems === 0 && !isOpen) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-display text-xl font-bold">Your Cart</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Cart Items */}
                <ScrollArea className="flex-1 p-4">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Group items by restaurant */}
                      {Object.entries(
                        items.reduce((acc, item) => {
                          if (!acc[item.restaurantId]) {
                            acc[item.restaurantId] = {
                              name: item.restaurantName,
                              phone: item.restaurantPhone,
                              items: [],
                            };
                          }
                          acc[item.restaurantId].items.push(item);
                          return acc;
                        }, {} as Record<string, { name: string; phone?: string; items: typeof items }>)
                      ).map(([restaurantId, restaurant]) => (
                        <NutriCard key={restaurantId} variant="elevated" className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{restaurant.name}</h3>
                            {restaurant.phone && (
                              <a href={`tel:${restaurant.phone}`} className="text-xs text-primary underline">
                                {restaurant.phone}
                              </a>
                            )}
                          </div>
                          <div className="space-y-3">
                            {restaurant.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {currencySymbol}{item.price}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </NutriCard>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="p-4 border-t space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-bold text-lg">
                        {currencySymbol}{totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={clearCart}>
                        Clear Cart
                      </Button>
                      <Button
                        variant="hero"
                        className="flex-1"
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/checkout");
                        }}
                      >
                        Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
