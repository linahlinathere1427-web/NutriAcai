import { motion } from "framer-motion";
import { Clock, Users, Flame, ChefHat, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  time: string;
  servings: number;
  calories: number;
  tags: string[];
  description: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
}

interface RecipeDetailDialogProps {
  recipe: RecipeDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeDetailDialog({ recipe, open, onOpenChange }: RecipeDetailDialogProps) {
  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-display text-xl font-bold text-white drop-shadow-lg">
              {recipe.title}
            </h2>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-12rem)]">
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{recipe.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-accent" />
                <span className="text-sm">{recipe.calories} kcal</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-muted-foreground">{recipe.description}</p>

            <Separator />

            {/* Nutrition */}
            <div>
              <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                Nutrition (per serving)
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-lg font-bold text-primary">{recipe.nutrition.protein}</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-lg font-bold text-primary">{recipe.nutrition.carbs}</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-lg font-bold text-primary">{recipe.nutrition.fat}</p>
                  <p className="text-xs text-muted-foreground">Fat</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-lg font-bold text-primary">{recipe.nutrition.fiber}</p>
                  <p className="text-xs text-muted-foreground">Fiber</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Ingredients */}
            <div>
              <h3 className="font-display font-bold mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">{ingredient}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <h3 className="font-display font-bold mb-3">Instructions</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3"
                  >
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm pt-0.5">{step}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
