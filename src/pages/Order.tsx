import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Gift, MapPin, ChevronDown, ChevronUp, Plus, Phone } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RestaurantCard } from "@/components/order/RestaurantCard";
import { LocationSearch } from "@/components/order/LocationSearch";
import { LocationPrompt } from "@/components/order/LocationPrompt";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { useProfile } from "@/hooks/useProfile";
import { useLocation } from "@/contexts/LocationContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const cuisineFilters = ["All", "Restaurants", "Cafes", "Fast Food", "Healthy"];

interface Restaurant {
  id: string;
  name: string;
  address: string;
  distance?: number;
  categories: string[];
  lat: number;
  lon: number;
  phone?: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  calories?: number;
}

const fallbackRestaurants = [
  {
    id: "featured-1",
    name: "The Green Kitchen",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=250&fit=crop",
    rating: 4.8,
    deliveryTime: "20-30 min",
    distance: "1.2 km",
    cuisine: ["Salads", "Bowls"],
    priceRange: "$$" as const,
    isOpen: true,
    phone: "+971 4 123 4567",
    menu: [
      { id: "gk-1", name: "Quinoa Power Bowl", price: 45, description: "Quinoa, avocado, chickpeas, mixed greens", calories: 420 },
      { id: "gk-2", name: "Mediterranean Salad", price: 38, description: "Fresh vegetables, feta, olives, olive oil", calories: 280 },
      { id: "gk-3", name: "Grilled Chicken Caesar", price: 52, description: "Grilled chicken breast, romaine, parmesan", calories: 380 },
      { id: "gk-4", name: "Superfood Smoothie", price: 28, description: "Acai, banana, spinach, almond milk", calories: 220 },
      { id: "gk-5", name: "Avocado Toast Deluxe", price: 35, description: "Sourdough, avocado, poached eggs, seeds", calories: 340 },
    ],
  },
  {
    id: "featured-2",
    name: "Acai Nation Dubai",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=250&fit=crop",
    rating: 4.9,
    deliveryTime: "15-25 min",
    distance: "0.8 km",
    cuisine: ["Smoothies", "Bowls"],
    priceRange: "$$" as const,
    isOpen: true,
    phone: "+971 4 234 5678",
    menu: [
      { id: "an-1", name: "Classic Açaí Bowl", price: 42, description: "Açaí, banana, granola, honey, mixed berries", calories: 340 },
      { id: "an-2", name: "Tropical Paradise Bowl", price: 48, description: "Açaí, mango, pineapple, coconut flakes", calories: 380 },
      { id: "an-3", name: "Protein Power Bowl", price: 55, description: "Açaí, peanut butter, whey protein, banana", calories: 520 },
      { id: "an-4", name: "Green Detox Smoothie", price: 32, description: "Spinach, kale, apple, ginger, lemon", calories: 180 },
      { id: "an-5", name: "Berry Blast Smoothie", price: 30, description: "Mixed berries, yogurt, honey", calories: 240 },
      { id: "an-6", name: "Chia Pudding Cup", price: 25, description: "Coconut milk, chia seeds, fresh fruit", calories: 290 },
    ],
  },
];

export default function Order() {
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  
  const { points } = useProfile();
  const { location, hasAskedLocation } = useLocation();
  const { addItem, currencySymbol } = useCart();

  // Show location prompt on first visit
  useEffect(() => {
    if (!hasAskedLocation) {
      setShowLocationPrompt(true);
    }
  }, [hasAskedLocation]);

  const handleRestaurantsFound = (newRestaurants: Restaurant[]) => {
    setRestaurants(newRestaurants);
    setHasSearched(true);
  };

  const handleLocationChange = () => {
    // Location changed, restaurants will be refetched
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample menus for nearby restaurants
  const getMenuForRestaurant = (restaurantId: string): MenuItem[] => {
    return [
      { id: `${restaurantId}-1`, name: "House Salad", price: 35, description: "Fresh mixed greens with house dressing", calories: 180 },
      { id: `${restaurantId}-2`, name: "Grilled Fish", price: 65, description: "Catch of the day with vegetables", calories: 420 },
      { id: `${restaurantId}-3`, name: "Vegetable Wrap", price: 38, description: "Whole wheat wrap with grilled veggies", calories: 320 },
      { id: `${restaurantId}-4`, name: "Fresh Juice", price: 22, description: "Seasonal fruit blend", calories: 120 },
    ];
  };

  const handleAddToCart = (
    item: MenuItem,
    restaurantId: string,
    restaurantName: string,
    restaurantPhone?: string
  ) => {
    addItem({
      id: item.id,
      restaurantId,
      restaurantName,
      restaurantPhone,
      name: item.name,
      price: item.price,
      description: item.description,
      calories: item.calories,
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <AppLayout>
      {/* Location Prompt */}
      {showLocationPrompt && (
        <LocationPrompt onLocationSet={() => setShowLocationPrompt(false)} />
      )}

      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">
              {location?.address || "Dubai Marina, UAE"}
            </span>
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
              <p className="text-sm opacity-90">1000 pts = {currencySymbol}1 discount</p>
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
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search all restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Cuisine Filters */}
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
              const menu = getMenuForRestaurant(restaurant.id);
              const isExpanded = expandedRestaurant === restaurant.id;
              
              return (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NutriCard variant="elevated" className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{restaurant.name}</h3>
                      {restaurant.phone && (
                        <a href={`tel:${restaurant.phone}`} className="text-primary">
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
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
                        {menu.map((item) => (
                          <div key={item.id} className="flex justify-between items-center gap-2 p-2 rounded-lg bg-muted/50">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              )}
                              {item.calories && (
                                <p className="text-xs text-muted-foreground">{item.calories} kcal</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary">{currencySymbol}{item.price}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleAddToCart(item, restaurant.id, restaurant.name, restaurant.phone)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
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

        {/* Featured Restaurants */}
        <div className="space-y-4">
          <h2 className="font-display font-bold">Featured Partners</h2>
          {fallbackRestaurants
            .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((restaurant, index) => {
              const isExpanded = expandedRestaurant === restaurant.id;
              
              return (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NutriCard variant="elevated" className="overflow-hidden p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-card/90 px-2 py-1 backdrop-blur-sm">
                        <Star className="h-4 w-4 fill-gold-reward text-gold-reward" />
                        <span className="font-semibold">{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display font-bold text-lg">{restaurant.name}</h3>
                        {restaurant.phone && (
                          <a href={`tel:${restaurant.phone}`} className="text-primary flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3" />
                            {restaurant.phone}
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {restaurant.cuisine.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {restaurant.deliveryTime} • {restaurant.distance} • {restaurant.priceRange}
                      </p>
                      
                      {/* Menu Toggle */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => setExpandedRestaurant(isExpanded ? null : restaurant.id)}
                      >
                        <span className="font-semibold">View Menu ({restaurant.menu.length} items)</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 space-y-2 border-t pt-3"
                        >
                          {restaurant.menu.map((item) => (
                            <div key={item.id} className="flex justify-between items-center gap-2 p-2 rounded-lg bg-muted/50">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                )}
                                {item.calories && (
                                  <p className="text-xs text-muted-foreground">{item.calories} kcal</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-primary">{currencySymbol}{item.price}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => handleAddToCart(
                                    item,
                                    restaurant.id,
                                    restaurant.name,
                                    restaurant.phone
                                  )}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </NutriCard>
                </motion.div>
              );
            })}
        </div>
      </div>
    </AppLayout>
  );
}
