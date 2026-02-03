import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={showNav ? "pb-24" : ""}
      >
        {children}
      </motion.main>
      {showNav && <BottomNav />}
    </div>
  );
}
