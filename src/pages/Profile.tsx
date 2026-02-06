import { motion } from "framer-motion";
import { User, Settings, CreditCard, HelpCircle, LogOut, ChevronRight, Star, Trophy, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const menuItems = [
  { icon: User, label: "Edit Profile", path: "/profile/edit" },
  { icon: CreditCard, label: "Payment Methods", path: "/payment" },
  { icon: HelpCircle, label: "FAQ & Help", path: "/faq" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const { points, streak } = useProfile();
  
  // Calculate dollar value of points
  const dollarValue = (points / 1000).toFixed(2);

  return (
    <AppLayout>
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display text-2xl font-bold">Profile</h1>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <NutriCard variant="gradient">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-lg">
                  {user?.email?.split("@")[0] || "NutriAcai User"}
                </h2>
                <p className="text-sm opacity-90">{user?.email || "user@example.com"}</p>
              </div>
            </div>
          </NutriCard>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <NutriCard variant="elevated">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gold-reward/20 flex items-center justify-center">
                  <Star className="h-5 w-5 text-gold-reward" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="font-display font-bold text-xl">{points.toLocaleString()}</p>
                  <p className="text-xs text-secondary">= ${dollarValue}</p>
                </div>
              </div>
            </NutriCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NutriCard variant="elevated">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Login Streak</p>
                  <p className="font-display font-bold text-xl">{streak} days</p>
                  {streak >= 90 && (
                    <p className="text-xs text-primary">🎉 +100 bonus!</p>
                  )}
                </div>
              </div>
            </NutriCard>
          </motion.div>
        </div>

        {/* Points Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <NutriCard className="bg-mint-light/50 border-secondary/30">
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-secondary" />
              <div>
                <p className="font-semibold text-sm">Redeem Points on Orders</p>
                <p className="text-xs text-muted-foreground">
                  1000 points = $1 discount. Use at checkout!
                </p>
              </div>
            </div>
          </NutriCard>
        </motion.div>

        {/* Streak Progress */}
        {streak < 90 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <NutriCard variant="elevated">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">90-Day Streak Challenge</p>
                <p className="text-xs text-muted-foreground">{streak}/90 days</p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(streak / 90) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                🏆 Complete 90 days for a +100 point bonus!
              </p>
            </NutriCard>
          </motion.div>
        )}

        {/* Menu Items */}
        <div className="space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.05 }}
            >
              <Link to={item.path}>
                <NutriCard variant="elevated" className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </NutriCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
}
