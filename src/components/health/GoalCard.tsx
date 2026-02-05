import { motion } from "framer-motion";
import { Target, Trash2 } from "lucide-react";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  id?: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  period: "daily" | "weekly" | "monthly";
  onDelete?: (id: string) => void;
  onIncrement?: (id: string) => void;
}

const periodColors = {
  daily: "text-accent",
  weekly: "text-secondary",
  monthly: "text-primary",
};

export function GoalCard({ 
  id, 
  title, 
  target, 
  current, 
  unit, 
  period,
  onDelete,
  onIncrement 
}: GoalCardProps) {
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isComplete = current >= target;

  return (
    <motion.div whileHover={{ y: -2 }}>
      <NutriCard variant="glass" className="min-w-[200px] relative">
        {id && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 opacity-50 hover:opacity-100"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
        <div className="flex items-center gap-2 mb-3">
          <Target className={cn("h-4 w-4", periodColors[period])} />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {period}
          </span>
        </div>
        <h4 className="font-semibold mb-2 pr-6">{title}</h4>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-display font-bold">{current}</span>
          <span className="text-muted-foreground">/ {target} {unit}</span>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        {isComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-semibold text-secondary"
          >
            ✓ Goal achieved!
          </motion.div>
        ) : id && onIncrement ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 text-xs"
            onClick={() => onIncrement(id)}
          >
            +1 {unit}
          </Button>
        ) : null}
      </NutriCard>
    </motion.div>
  );
}
