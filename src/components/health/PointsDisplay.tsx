import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";

interface PointsDisplayProps {
  points: number;
  streak?: number;
}

export function PointsDisplay({ points, streak = 0 }: PointsDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="gradient-primary rounded-2xl p-5 text-primary-foreground shadow-glow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">Your Points</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold">{points.toLocaleString()}</span>
            <Star className="h-6 w-6 fill-current" />
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-primary-foreground/20 px-3 py-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">{streak} day streak</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
