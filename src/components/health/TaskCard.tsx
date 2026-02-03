import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  title: string;
  description: string;
  points: number;
  completed?: boolean;
  icon?: React.ReactNode;
  onComplete?: () => void;
}

export function TaskCard({
  title,
  description,
  points,
  completed = false,
  icon,
  onComplete,
}: TaskCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <NutriCard
        variant="elevated"
        className={cn(
          "cursor-pointer border-2 transition-all",
          completed
            ? "border-secondary bg-mint-light/30"
            : "border-transparent hover:border-primary/20"
        )}
        onClick={onComplete}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
              completed
                ? "gradient-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {completed ? <Check className="h-6 w-6" /> : icon}
          </div>
          <div className="flex-1">
            <h4 className={cn("font-semibold", completed && "line-through opacity-60")}>
              {title}
            </h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-gold-reward/20 px-2 py-1 text-sm font-semibold text-gold-reward">
            <Star className="h-4 w-4 fill-current" />
            <span>+{points}</span>
          </div>
        </div>
      </NutriCard>
    </motion.div>
  );
}
