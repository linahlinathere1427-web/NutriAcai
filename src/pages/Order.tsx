import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Gift, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RestaurantCard } from "@/components/order/RestaurantCard";
import { LocationSearch } from "@/components/order/LocationSearch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { useProfile } from "@/hooks/useProfile";

const cuisineFilters = ["All", "Restaurants", "Cafes", "Fast Food", "Healthy"];

interface Restaurant {
  id: string;
  name: string;
  address: string;
  distance?: number;
  categories: string[];
  lat: number;
  lon: number;
}

interface MenuItem {
  name: string;
  price: number;
  description?: string;
  calories?: number;
}

const fallbackRestaurants = [
  {
    id: "1",
    name: "The Green Kitchen",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=250&fit=crop",
    rating: 4.8,
    deliveryTime: "20-30 min",
    distance: "1.2 km",
    cuisine: ["Salads", "Bowls"],
    priceRange: "$$" as const,
    isOpen: true,
    menu: [
      { name: "Quinoa Power Bowl", price: 45, description: "Quinoa, avocado, chickpeas, mixed greens", calories: 420 },
      { name: "Mediterranean Salad", price: 38, description: "Fresh vegetables, feta, olives, olive oil", calories: 280 },
      { name: "Grilled Chicken Caesar", price: 52, description: "Grilled chicken breast, romaine, parmesan", calories: 380 },
      { name: "Superfood Smoothie", price: 28, description: "Acai, banana, spinach, almond milk", calories: 220 },
      { name: "Avocado Toast Deluxe", price: 35, description: "Sourdough, avocado, poached eggs, seeds", calories: 340 },
    ],
  },
  {
    id: "2",
    name: "Acai Nation Dubai",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=250&fit=crop",
    rating: 4.9,
    deliveryTime: "15-25 min",
    distance: "0.8 km",
    cuisine: ["Smoothies", "Bowls"],
    priceRange: "$$" as const,
    isOpen: true,
    menu: [
      { name: "Classic Açaí Bowl", price: 42, description: "Açaí, banana, granola, honey, mixed berries", calories: 340 },
      { name: "Tropical Paradise Bowl", price: 48, description: "Açaí, mango, pineapple, coconut flakes", calories: 380 },
      { name: "Protein Power Bowl", price: 55, description: "Açaí, peanut butter, whey protein, banana", calories: 520 },
      { name: "Green Detox Smoothie", price: 32, description: "Spinach, kale, apple, ginger, lemon", calories: 180 },
      { name: "Berry Blast Smoothie", price: 30, description: "Mixed berries, yogurt, honey", calories: 240 },
      { name: "Chia Pudding Cup", price: 25, description: "Coconut milk, chia seeds, fresh fruit", calories: 290 },
    ],
  },
];

export default function Order() {
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentLocation, setCurrentLocation] = useState("Dubai Marina");
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null);
  const { points } = useProfile();

  const handleRestaurantsFound = (newRestaurants: Restaurant[]) => {
    setRestaurants(newRestaurants);
    setHasSearched(true);
  };

  const handleLocationChange = (address: string) => {
    setCurrentLocation(address);
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample menus for nearby restaurants (would come from API in production)
  const getMenuForRestaurant = (name: string): MenuItem[] => {
    const menuSamples: Record<string, MenuItem[]> = {
      default: [
        { name: "House Salad", price: 35, description: "Fresh mixed greens with house dressing", calories: 180 },
        { name: "Grilled Fish", price: 65, description: "Catch of the day with vegetables", calories: 420 },
        { name: "Vegetable Wrap", price: 38, description: "Whole wheat wrap with grilled veggies", calories: 320 },
        { name: "Fresh Juice", price: 22, description: "Seasonal fruit blend", calories: 120 },
      ],
    };
    return menuSamples.default;
  };

  return (
    <AppLayout>
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{currentLocation}</span>
          </div>
          <h1 className="font-display text-2xl font-bold">Healthy Ordering</h1>
        </motion.div>

        {/* Points Reward Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <NutriCard variant="gradient" className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Gift className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">You have {points} points!</p>
              <p className="text-sm opacity-90">1000 pts = $1 discount on orders</p>
            </div>
            <Star className="h-8 w-8 fill-current opacity-50" />
          </NutriCard>
        </motion.div>

        {/* Location Search */}
        <LocationSearch
          onRestaurantsFound={handleRestaurantsFound}
          onLocationChange={handleLocationChange}
        />

        {/* Search */}
        {hasSearched && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        )}

        {/* Cuisine Filters */}
        {hasSearched && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-5 px-5 scrollbar-hide">
            {cuisineFilters.map((cuisine) => (
              <Badge
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm"
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </Badge>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="rounded-xl bg-mint-light/50 border border-secondary/30 p-4 mb-6">
          <p className="text-sm text-foreground">
            <span className="font-semibold">🥗 Only healthy options!</span>{" "}
            We've curated restaurants that prioritize your wellness.
          </p>
        </div>

        {/* Restaurants from API */}
        {hasSearched && filteredRestaurants.length > 0 && (
          <div className="space-y-4 mb-6">
            <h2 className="font-display font-bold">Nearby Restaurants</h2>
            {filteredRestaurants.map((restaurant, index) => {
              const menu = getMenuForRestaurant(restaurant.name);
              const isExpanded = expandedRestaurant === restaurant.id;
              
              return (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NutriCard variant="elevated" className="p-4">
                    <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {restaurant.address}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {restaurant.categories.slice(0, 3).map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {cat.split(".").pop()}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Menu Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setExpandedRestaurant(isExpanded ? null : restaurant.id)}
                    >
                      <span className="font-semibold">View Menu</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 space-y-2 border-t pt-3"
                      >
                        {menu.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start gap-2 p-2 rounded-lg bg-muted/50">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              )}
                              {item.calories && (
                                <p className="text-xs text-muted-foreground">{item.calories} kcal</p>
                              )}
                            </div>
                            <span className="font-semibold text-primary">AED {item.price}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </NutriCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {hasSearched && filteredRestaurants.length === 0 && (
          <NutriCard className="p-8 text-center mb-6">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-display font-bold mb-2">No restaurants found</h3>
            <p className="text-sm text-muted-foreground">
              Try searching a different location or adjusting your filters.
            </p>
          </NutriCard>
        )}

        {/* Fallback Featured Restaurants */}
        <div className="space-y-4">
          <h2 className="font-display font-bold">Featured Partners</h2>
          {fallbackRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RestaurantCard {...restaurant} />
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
