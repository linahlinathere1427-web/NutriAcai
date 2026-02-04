import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Plus, Check, ShieldCheck, Gift, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PaymentMethod {
  id: number;
  type: "card" | "paypal";
  last4?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
}

const savedPayments: PaymentMethod[] = [
  { id: 1, type: "card", last4: "4242", brand: "Visa", isDefault: true },
  { id: 2, type: "paypal", email: "user@gmail.com", isDefault: false },
];

export default function Payment() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [orderAmount, setOrderAmount] = useState(2500); // $25.00 in cents
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useAuth();
  const { points } = useProfile();
  
  // Calculate discount
  const maxPointsToRedeem = Math.min(points, Math.floor(orderAmount / 100) * 1000);
  const discountAmount = redeemPoints ? Math.floor(maxPointsToRedeem / 1000) * 100 : 0;
  const finalAmount = Math.max(orderAmount - discountAmount, 50);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          amount: orderAmount,
          redeemPoints: redeemPoints,
          pointsToRedeem: redeemPoints ? maxPointsToRedeem : 0,
        },
      });

      if (error) throw error;

      if (data.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, "_blank");
        toast.success("Redirecting to checkout...");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppLayout showNav={false}>
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-display text-2xl font-bold">Payment Methods</h1>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 rounded-xl bg-mint-light/50 border border-secondary/30 p-4">
            <ShieldCheck className="h-6 w-6 text-secondary" />
            <div>
              <p className="font-semibold text-sm">Secure Payments via Stripe</p>
              <p className="text-xs text-muted-foreground">Your data is encrypted and protected</p>
            </div>
          </div>
        </motion.div>

        {/* Points Redemption Card */}
        {user && points > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <NutriCard variant="gradient" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Redeem Points</p>
                    <p className="text-sm opacity-80">You have {points} points</p>
                  </div>
                </div>
                <Switch
                  checked={redeemPoints}
                  onCheckedChange={setRedeemPoints}
                />
              </div>
              {redeemPoints && (
                <div className="mt-3 pt-3 border-t border-primary-foreground/20">
                  <div className="flex justify-between text-sm">
                    <span>Points to redeem:</span>
                    <span className="font-semibold">{maxPointsToRedeem} pts</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Discount:</span>
                    <span className="font-semibold text-secondary">-${(discountAmount / 100).toFixed(2)}</span>
                  </div>
                  <p className="text-xs opacity-70 mt-2">1000 pts = $1 discount</p>
                </div>
              )}
            </NutriCard>
          </motion.div>
        )}

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <NutriCard variant="elevated" className="p-4">
            <h3 className="font-display font-bold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(orderAmount / 100).toFixed(2)}</span>
              </div>
              {redeemPoints && discountAmount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Points Discount</span>
                  <span>-${(discountAmount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(finalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              variant="hero"
              onClick={handleCheckout}
              disabled={isProcessing || !user}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout with Stripe
                </>
              )}
            </Button>
            {!user && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Please <Link to="/auth" className="text-primary underline">sign in</Link> to checkout
              </p>
            )}
          </NutriCard>
        </motion.div>

        {/* Saved Payment Methods */}
        <div className="mb-6">
          <h2 className="font-display font-semibold mb-4">Saved Methods</h2>
          <div className="space-y-3">
            {savedPayments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NutriCard
                  variant="elevated"
                  className={`flex items-center gap-4 ${
                    payment.isDefault ? "border-2 border-primary" : ""
                  }`}
                >
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                    {payment.type === "card" ? (
                      <CreditCard className="h-6 w-6 text-primary" />
                    ) : (
                      <span className="text-xl font-bold text-primary mr-2">P</span>
                    )}
                  </div>
                  <div className="flex-1">
                    {payment.type === "card" ? (
                      <>
                        <p className="font-semibold">{payment.brand} •••• {payment.last4}</p>
                        <p className="text-sm text-muted-foreground">Credit Card</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">PayPal</p>
                        <p className="text-sm text-muted-foreground">{payment.email}</p>
                      </>
                    )}
                  </div>
                  {payment.isDefault && (
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <Check className="h-4 w-4" />
                      Default
                    </div>
                  )}
                </NutriCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add New Card */}
        {!showAddCard ? (
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-14"
              onClick={() => setShowAddCard(true)}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Add Credit Card
            </Button>
            <Button variant="outline" className="w-full h-14">
              <span className="text-xl font-bold text-primary mr-2">P</span>
              Connect PayPal
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NutriCard variant="elevated">
              <h3 className="font-display font-bold mb-4">Add New Card</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddCard(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="hero" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Card
                  </Button>
                </div>
              </div>
            </NutriCard>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
