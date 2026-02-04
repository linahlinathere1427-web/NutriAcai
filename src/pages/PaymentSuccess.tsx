import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Gift } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const pointsUsed = parseInt(searchParams.get("points_used") || "0", 10);
  const { deductPoints } = useProfile();

  useEffect(() => {
    // Deduct points if any were used
    if (pointsUsed > 0) {
      deductPoints(pointsUsed);
    }
  }, [pointsUsed, deductPoints]);

  return (
    <AppLayout showNav={false}>
      <div className="px-5 py-6 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle className="h-14 w-14 text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">Your order has been confirmed</p>
        </motion.div>

        {pointsUsed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 w-full max-w-sm"
          >
            <NutriCard variant="gradient" className="text-center">
              <Gift className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">{pointsUsed} points redeemed!</p>
              <p className="text-sm opacity-80">
                You saved ${(Math.floor(pointsUsed / 1000)).toFixed(2)}
              </p>
            </NutriCard>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4 w-full max-w-sm"
        >
          <Link to="/order">
            <Button className="w-full" variant="hero">
              Order More Food
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="w-full" variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </AppLayout>
  );
}
