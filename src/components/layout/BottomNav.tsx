import { Heart, ChefHat, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Heart, label: "Health", path: "/dashboard" },
  { icon: ChefHat, label: "Recipes", path: "/recipes" },
  { icon: ShoppingBag, label: "Order", path: "/order" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 px-4 pb-safe"
    >
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-6 w-6 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                  />
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
