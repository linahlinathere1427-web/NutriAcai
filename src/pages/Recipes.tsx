import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, Flame, ChefHat, ExternalLink } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { KitchenSearch } from "@/components/recipes/KitchenSearch";
import { RecipeDetailDialog } from "@/components/recipes/RecipeDetailDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Smoothies"];

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

const recipes: RecipeDetail[] = [
  {
    id: 1,
    title: "Açaí Breakfast Bowl",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    time: "10 min",
    servings: 1,
    calories: 340,
    tags: ["Vegan", "High Fiber", "Quick"],
    description: "A refreshing and nutritious breakfast bowl packed with antioxidants from açaí berries and topped with fresh fruits and crunchy granola.",
    ingredients: [
      "2 frozen açaí packets (100g each)",
      "1 ripe banana, frozen",
      "1/2 cup almond milk",
      "1/4 cup granola",
      "Fresh berries (strawberries, blueberries)",
      "1 tbsp honey or agave",
      "1 tbsp chia seeds",
      "Sliced almonds for topping",
    ],
    instructions: [
      "Blend frozen açaí packets with frozen banana and almond milk until smooth and thick.",
      "Pour the mixture into a bowl.",
      "Top with granola, fresh berries, and sliced almonds.",
      "Drizzle with honey and sprinkle chia seeds on top.",
      "Serve immediately and enjoy!",
    ],
    nutrition: { protein: "8g", carbs: "52g", fat: "12g", fiber: "9g" },
  },
  {
    id: 2,
    title: "Grilled Salmon with Quinoa",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    time: "25 min",
    servings: 2,
    calories: 420,
    tags: ["High Protein", "Omega-3", "Gluten Free"],
    description: "A perfectly grilled salmon fillet served over fluffy quinoa with roasted vegetables. Rich in omega-3 fatty acids and complete proteins.",
    ingredients: [
      "2 salmon fillets (150g each)",
      "1 cup quinoa, rinsed",
      "2 cups vegetable broth",
      "1 lemon, juiced and zested",
      "2 tbsp olive oil",
      "1 cup cherry tomatoes",
      "1 cup asparagus, trimmed",
      "Salt, pepper, and fresh dill",
    ],
    instructions: [
      "Cook quinoa in vegetable broth according to package directions. Fluff with a fork.",
      "Season salmon with salt, pepper, lemon zest, and olive oil.",
      "Grill salmon for 4-5 minutes per side until cooked through.",
      "Roast cherry tomatoes and asparagus with olive oil at 400°F for 15 minutes.",
      "Serve salmon over quinoa with roasted vegetables. Drizzle with lemon juice and garnish with fresh dill.",
    ],
    nutrition: { protein: "35g", carbs: "38g", fat: "18g", fiber: "5g" },
  },
  {
    id: 3,
    title: "Mediterranean Chickpea Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    time: "15 min",
    servings: 4,
    calories: 280,
    tags: ["Vegan", "High Fiber", "Fresh"],
    description: "A vibrant and filling salad featuring chickpeas, crisp vegetables, and a tangy lemon-herb dressing. Perfect for meal prep!",
    ingredients: [
      "2 cans chickpeas, drained and rinsed",
      "1 cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "1/2 red onion, thinly sliced",
      "1/2 cup kalamata olives",
      "1/2 cup feta cheese, crumbled",
      "3 tbsp olive oil",
      "2 tbsp lemon juice",
      "Fresh parsley and oregano",
    ],
    instructions: [
      "Combine chickpeas, cucumber, tomatoes, red onion, and olives in a large bowl.",
      "Whisk together olive oil, lemon juice, salt, and pepper for the dressing.",
      "Pour dressing over the salad and toss to combine.",
      "Top with crumbled feta cheese and fresh herbs.",
      "Refrigerate for 30 minutes before serving for best flavor.",
    ],
    nutrition: { protein: "12g", carbs: "32g", fat: "14g", fiber: "8g" },
  },
  {
    id: 4,
    title: "Green Power Smoothie",
    image: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&h=300&fit=crop",
    time: "5 min",
    servings: 1,
    calories: 180,
    tags: ["Vegan", "Detox", "Quick"],
    description: "A nutrient-dense green smoothie that tastes delicious while giving you a powerful boost of vitamins and minerals.",
    ingredients: [
      "2 cups fresh spinach",
      "1 ripe banana",
      "1/2 cup frozen mango",
      "1/2 cucumber",
      "1 tbsp fresh ginger",
      "1 cup coconut water",
      "1 tbsp chia seeds",
      "Ice cubes",
    ],
    instructions: [
      "Add coconut water and spinach to blender first.",
      "Blend until spinach is fully broken down.",
      "Add banana, mango, cucumber, and ginger.",
      "Blend until smooth and creamy.",
      "Add chia seeds and pulse briefly. Serve immediately.",
    ],
    nutrition: { protein: "4g", carbs: "35g", fat: "3g", fiber: "6g" },
  },
  {
    id: 5,
    title: "Avocado Toast with Eggs",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
    time: "10 min",
    servings: 2,
    calories: 380,
    tags: ["High Protein", "Quick", "Breakfast"],
    description: "The ultimate breakfast - creamy avocado on toasted sourdough topped with perfectly poached eggs and a sprinkle of everything bagel seasoning.",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tbsp white vinegar (for poaching)",
      "Everything bagel seasoning",
      "Red pepper flakes",
      "Fresh microgreens",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Toast sourdough slices until golden brown.",
      "Mash avocado with salt, pepper, and a squeeze of lemon.",
      "Bring water to a simmer, add vinegar, and poach eggs for 3 minutes.",
      "Spread mashed avocado on toast.",
      "Top with poached eggs, everything seasoning, red pepper flakes, and microgreens.",
    ],
    nutrition: { protein: "16g", carbs: "28g", fat: "24g", fiber: "7g" },
  },
  {
    id: 6,
    title: "Thai Coconut Curry Bowl",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    time: "30 min",
    servings: 4,
    calories: 450,
    tags: ["Spicy", "Comfort", "Dinner"],
    description: "A warming and aromatic Thai-inspired curry with vegetables and your choice of protein, served over jasmine rice.",
    ingredients: [
      "1 can coconut milk (400ml)",
      "2 tbsp red curry paste",
      "400g tofu or chicken, cubed",
      "2 cups mixed vegetables (bell peppers, broccoli, snap peas)",
      "2 cups jasmine rice, cooked",
      "2 tbsp fish sauce or soy sauce",
      "1 tbsp brown sugar",
      "Fresh basil and lime for garnish",
    ],
    instructions: [
      "Heat a large pan and add 1/4 cup coconut milk. Stir in curry paste until fragrant.",
      "Add protein and cook until golden.",
      "Pour in remaining coconut milk, fish sauce, and brown sugar. Simmer for 10 minutes.",
      "Add vegetables and cook until tender-crisp.",
      "Serve over jasmine rice, garnished with fresh basil and lime wedges.",
    ],
    nutrition: { protein: "22g", carbs: "48g", fat: "22g", fiber: "4g" },
  },
];

export default function Recipes() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
      recipe.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

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
                  onClick={() => setSelectedRecipe(recipe)}
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

        {/* Recipe Detail Dialog */}
        <RecipeDetailDialog
          recipe={selectedRecipe}
          open={!!selectedRecipe}
          onOpenChange={(open) => !open && setSelectedRecipe(null)}
        />
      </div>
    </AppLayout>
  );
}
