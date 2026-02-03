import { motion } from "framer-motion";
import { Star, Clock, MapPin } from "lucide-react";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  cuisine: string[];
  priceRange: "$" | "$$" | "$$$";
  isOpen?: boolean;
}

export function RestaurantCard({
  name,
  image,
  rating,
  deliveryTime,
  distance,
  cuisine,
  priceRange,
  isOpen = true,
}: RestaurantCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <NutriCard variant="elevated" className="overflow-hidden p-0">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {!isOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="rounded-lg bg-card px-3 py-1 font-semibold">
                Currently Closed
              </span>
            </div>
          )}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-card/90 px-2 py-1 backdrop-blur-sm">
            <Star className="h-4 w-4 fill-gold-reward text-gold-reward" />
            <span className="font-semibold">{rating}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-bold text-lg line-clamp-1">{name}</h3>
            <span className="text-sm text-muted-foreground">{priceRange}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {cuisine.slice(0, 2).map((c) => (
              <Badge key={c} variant="outline" className="text-xs">
                {c}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{distance}</span>
            </div>
          </div>
        </div>
      </NutriCard>
    </motion.div>
  );
}
