import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Gift } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RestaurantCard } from "@/components/order/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NutriCard } from "@/components/ui/card-nutriacai";

const cuisineFilters = ["All", "Salads", "Bowls", "Smoothies", "Vegan", "Mediterranean"];

const restaurants = [
  {
    id: 1,
    name: "The Green Kitchen",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=250&fit=crop",
    rating: 4.8,
    deliveryTime: "20-30 min",
    distance: "1.2 km",
    cuisine: ["Salads", "Bowls"],
    priceRange: "$$" as const,
    isOpen: true,
  },
  {
    id: 2,
    name: "Acai Nation Dubai",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=250&fit=crop",
    rating: 4.9,
    deliveryTime: "15-25 min",
    distance: "0.8 km",
    cuisine: ["Smoothies", "Bowls"],
    priceRange: "$$" as const,
    isOpen: true,
  },
  {
    id: 3,
    name: "Mediterranean Bites",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=250&fit=crop",
    rating: 4.6,
    deliveryTime: "25-35 min",
    distance: "2.1 km",
    cuisine: ["Mediterranean", "Healthy"],
    priceRange: "$$$" as const,
    isOpen: true,
  },
  {
    id: 4,
    name: "Fresh Fuel",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop",
    rating: 4.7,
    deliveryTime: "20-30 min",
    distance: "1.5 km",
    cuisine: ["Vegan", "Organic"],
    priceRange: "$$" as const,
    isOpen: false,
  },
  {
    id: 5,
    name: "Protein House",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop",
    rating: 4.5,
    deliveryTime: "30-40 min",
    distance: "3.2 km",
    cuisine: ["High Protein", "Fitness"],
    priceRange: "$" as const,
    isOpen: true,
  },
];

export default function Order() {
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const userPoints = 1250;

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
            <span className="text-sm">Delivering to Dubai Marina</span>
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
              <p className="font-semibold">You have {userPoints} points!</p>
              <p className="text-sm opacity-90">Redeem for discounts on your next order</p>
            </div>
            <Star className="h-8 w-8 fill-current opacity-50" />
          </NutriCard>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search healthy restaurants..."
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

        {/* Restaurants */}
        <div className="space-y-4">
          {restaurants.map((restaurant, index) => (
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
