import { motion } from "framer-motion";
import { User, Settings, CreditCard, HelpCircle, LogOut, ChevronRight, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: User, label: "Edit Profile", path: "/profile/edit" },
  { icon: CreditCard, label: "Payment Methods", path: "/payment" },
  { icon: HelpCircle, label: "FAQ & Help", path: "/faq" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Profile() {
  const { user, signOut } = useAuth();

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
                  <p className="font-display font-bold text-xl">1,250</p>
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
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="font-display font-bold text-xl">7 days</p>
                </div>
              </div>
            </NutriCard>
          </motion.div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
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
