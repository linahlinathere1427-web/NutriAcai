import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, Flame } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { KitchenSearch } from "@/components/recipes/KitchenSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Smoothies"];

const recipes = [
  {
    id: 1,
    title: "Açaí Breakfast Bowl",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    time: "10 min",
    servings: 1,
    calories: 340,
    tags: ["Vegan", "High Fiber", "Quick"],
  },
  {
    id: 2,
    title: "Grilled Salmon with Quinoa",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    time: "25 min",
    servings: 2,
    calories: 420,
    tags: ["High Protein", "Omega-3", "Gluten Free"],
  },
  {
    id: 3,
    title: "Mediterranean Chickpea Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    time: "15 min",
    servings: 4,
    calories: 280,
    tags: ["Vegan", "High Fiber", "Fresh"],
  },
  {
    id: 4,
    title: "Green Power Smoothie",
    image: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&h=300&fit=crop",
    time: "5 min",
    servings: 1,
    calories: 180,
    tags: ["Vegan", "Detox", "Quick"],
  },
  {
    id: 5,
    title: "Avocado Toast with Eggs",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
    time: "10 min",
    servings: 2,
    calories: 380,
    tags: ["High Protein", "Quick", "Breakfast"],
  },
  {
    id: 6,
    title: "Thai Coconut Curry Bowl",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    time: "30 min",
    servings: 4,
    calories: 450,
    tags: ["Spicy", "Comfort", "Dinner"],
  },
];

export default function Recipes() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display text-2xl font-bold mb-1">Recipes</h1>
          <p className="text-muted-foreground">Healthy & delicious meals for you</p>
        </motion.div>

        {/* Tabs for Kitchen Search vs Browse */}
        <Tabs defaultValue="kitchen" className="mb-6">
          <TabsList className="w-full">
            <TabsTrigger value="kitchen" className="flex-1">🍳 Kitchen Search</TabsTrigger>
            <TabsTrigger value="browse" className="flex-1">📖 Browse Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value="kitchen" className="mt-6">
            <KitchenSearch />
          </TabsContent>

          <TabsContent value="browse" className="mt-6">
            {/* Search */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Filter className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Quick (under 15 min)</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2">
                <Flame className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Low Cal</span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-5 px-5 scrollbar-hide">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard
                    {...recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={() => toggleFavorite(recipe.id)}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
