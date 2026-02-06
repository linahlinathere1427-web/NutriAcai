import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Banknote, Gift, Loader2, Check, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PaymentMethod = "stripe" | "paypal" | "cash";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, currencySymbol, clearCart, currency } = useCart();
  const { user } = useAuth();
  const { points } = useProfile();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Convert to cents for Stripe
  const amountInCents = Math.round(totalAmount * 100);
  
  // Calculate discount (1000 pts = 100 cents = $1)
  const maxPointsToRedeem = Math.min(points, Math.floor(amountInCents / 100) * 1000);
  const discountAmount = redeemPoints ? Math.floor(maxPointsToRedeem / 1000) * 100 : 0;
  const finalAmountCents = Math.max(amountInCents - discountAmount, 50);
  const finalAmount = finalAmountCents / 100;

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      return;
    }

    if (!deliveryAddress.trim() || !phoneNumber.trim()) {
      toast.error("Please fill in delivery details");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "cash") {
        // Cash on delivery - just confirm the order
        toast.success("Order placed! Pay on delivery.");
        clearCart();
        navigate("/payment-success?method=cash");
        return;
      }

      if (paymentMethod === "paypal") {
        toast.info("PayPal integration coming soon! Please use Stripe or Cash on Delivery.");
        setIsProcessing(false);
        return;
      }

      // Stripe payment
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          amount: amountInCents,
          redeemPoints: redeemPoints,
          pointsToRedeem: redeemPoints ? maxPointsToRedeem : 0,
        },
      });

      if (error) throw error;

      if (data.url) {
        clearCart();
        window.open(data.url, "_blank");
        toast.success("Redirecting to checkout...");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <AppLayout showNav={false}>
        <div className="px-5 py-6 min-h-screen flex flex-col items-center justify-center">
          <h1 className="font-display text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/order">
            <Button variant="hero">Browse Restaurants</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link to="/order">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-display text-2xl font-bold">Checkout</h1>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <NutriCard variant="elevated" className="p-4">
            <h3 className="font-display font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                    <span className="text-muted-foreground ml-1">({item.restaurantName})</span>
                  </span>
                  <span>{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{currencySymbol}{totalAmount.toFixed(2)}</span>
              </div>
              {redeemPoints && discountAmount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Points Discount ({maxPointsToRedeem} pts)</span>
                  <span>-{currencySymbol}{(discountAmount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{currencySymbol}{finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </NutriCard>
        </motion.div>

        {/* Delivery Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <NutriCard variant="elevated" className="p-4">
            <h3 className="font-display font-bold mb-4">Delivery Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your full address..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+971 50 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>
            </div>
          </NutriCard>
        </motion.div>

        {/* Points Redemption */}
        {user && points > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <NutriCard variant="gradient" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Redeem Points</p>
                    <p className="text-sm opacity-80">You have {points} pts (1000 = {currencySymbol}1)</p>
                  </div>
                </div>
                <Switch checked={redeemPoints} onCheckedChange={setRedeemPoints} />
              </div>
            </NutriCard>
          </motion.div>
        )}

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <NutriCard variant="elevated" className="p-4">
            <h3 className="font-display font-bold mb-4">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-xs text-muted-foreground">Pay securely with Stripe</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                  <span className="text-xl font-bold text-blue-600">P</span>
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground">Pay with your PayPal account</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Banknote className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </NutriCard>
        </motion.div>

        {/* Place Order Button */}
        <Button
          variant="hero"
          className="w-full h-14"
          onClick={handleCheckout}
          disabled={isProcessing || !deliveryAddress.trim() || !phoneNumber.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              Place Order - {currencySymbol}{finalAmount.toFixed(2)}
            </>
          )}
        </Button>

        {!user && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Please <Link to="/auth" className="text-primary underline">sign in</Link> to checkout
          </p>
        )}
      </div>
    </AppLayout>
  );
}
