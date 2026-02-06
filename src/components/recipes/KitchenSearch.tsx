import { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Search, Loader2, UtensilsCrossed, Clock, Users } from "lucide-react";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface GeneratedRecipe {
  content: string;
}

export function KitchenSearch() {
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchRecipes = async () => {
    if (!ingredients.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("recipe-agent", {
        body: { ingredients: ingredients, action: "search" },
      });

      if (fnError) throw fnError;

      setRecipe({
        content: data.recipe || "No recipe found. Please try different ingredients.",
      });
    } catch (err) {
      console.error("Recipe search error:", err);
      setError("Failed to generate recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <NutriCard variant="elevated" className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold">Kitchen Search</h3>
            <p className="text-xs text-muted-foreground">Tell me what's in your kitchen</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchRecipes();
          }}
          className="space-y-3"
        >
          <Input
            placeholder="e.g., chicken, rice, tomatoes, garlic..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            disabled={isLoading}
            className="h-12"
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !ingredients.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Find Recipes
              </>
            )}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setIngredients("chicken, broccoli, garlic")}>
            🍗 Chicken
          </Badge>
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setIngredients("salmon, lemon, asparagus")}>
            🐟 Salmon
          </Badge>
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setIngredients("tofu, vegetables, soy sauce")}>
            🥬 Vegan
          </Badge>
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setIngredients("eggs, spinach, cheese")}>
            🥚 Breakfast
          </Badge>
        </div>
      </NutriCard>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <NutriCard className="p-4 bg-destructive/10 border-destructive/30">
            <p className="text-destructive text-sm">{error}</p>
          </NutriCard>
        </motion.div>
      )}

      {/* Generated Recipe */}
      {recipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <NutriCard variant="gradient" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Your Custom Recipe</h3>
                <p className="text-sm opacity-80">Based on: {ingredients}</p>
              </div>
            </div>

            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-primary-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mt-4 mb-2 text-primary-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1 text-primary-foreground">{children}</h3>,
                  p: ({ children }) => <p className="text-primary-foreground/90 mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 text-primary-foreground/90 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 text-primary-foreground/90 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-primary-foreground/90">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-primary-foreground">{children}</strong>,
                  img: ({ src, alt }) => (
                    <div className="my-4 rounded-xl overflow-hidden">
                      <img 
                        src={src} 
                        alt={alt || "Recipe image"} 
                        className="w-full h-48 object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ),
                }}
              >
                {recipe.content}
              </ReactMarkdown>
            </div>
          </NutriCard>
        </motion.div>
      )}

      {/* Empty State */}
      {!recipe && !isLoading && !error && (
        <NutriCard className="p-8 text-center">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-display font-bold mb-2">Ready to Cook?</h3>
          <p className="text-sm text-muted-foreground">
            Enter the ingredients you have, and our AI chef will create a healthy recipe just for you!
          </p>
        </NutriCard>
      )}
    </div>
  );
}
