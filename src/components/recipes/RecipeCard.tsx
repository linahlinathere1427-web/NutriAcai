import { motion } from "framer-motion";
import { Clock, Users, Heart } from "lucide-react";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  title: string;
  image: string;
  time: string;
  servings: number;
  calories: number;
  tags: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function RecipeCard({
  title,
  image,
  time,
  servings,
  calories,
  tags,
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <NutriCard variant="elevated" className="overflow-hidden p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? "fill-accent text-accent" : "text-muted-foreground"
              }`}
            />
          </button>
          <div className="absolute bottom-3 left-3 rounded-lg bg-card/80 px-2 py-1 text-sm font-semibold backdrop-blur-sm">
            {calories} kcal
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display font-bold text-lg mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{servings}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </NutriCard>
    </motion.div>
  );
}
