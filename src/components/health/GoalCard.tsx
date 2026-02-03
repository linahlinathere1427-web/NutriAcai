import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
  title: string;
  target: number;
  current: number;
  unit: string;
  period: "daily" | "weekly" | "monthly";
}

const periodColors = {
  daily: "text-accent",
  weekly: "text-secondary",
  monthly: "text-primary",
};

export function GoalCard({ title, target, current, unit, period }: GoalCardProps) {
  const progress = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <motion.div whileHover={{ y: -2 }}>
      <NutriCard variant="glass" className="min-w-[200px]">
        <div className="flex items-center gap-2 mb-3">
          <Target className={cn("h-4 w-4", periodColors[period])} />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {period}
          </span>
        </div>
        <h4 className="font-semibold mb-2">{title}</h4>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-display font-bold">{current}</span>
          <span className="text-muted-foreground">/ {target} {unit}</span>
        </div>
        <Progress value={progress} className="h-2" />
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 text-xs font-semibold text-secondary"
          >
            ✓ Goal achieved!
          </motion.div>
        )}
      </NutriCard>
    </motion.div>
  );
}

function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
