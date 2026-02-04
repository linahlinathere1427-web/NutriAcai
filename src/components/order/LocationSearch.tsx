import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, Navigation, Star, Clock, AlertCircle } from "lucide-react";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  distance?: number;
  categories: string[];
  lat: number;
  lon: number;
}

interface LocationSearchProps {
  onRestaurantsFound: (restaurants: Restaurant[]) => void;
  onLocationChange: (address: string) => void;
}

export function LocationSearch({ onRestaurantsFound, onLocationChange }: LocationSearchProps) {
  const [address, setAddress] = useState("Dubai Marina, Dubai, UAE");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  const searchLocation = async () => {
    if (!address.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // First geocode the address
      const { data: geoData, error: geoError } = await supabase.functions.invoke("location-restaurants", {
        body: { action: "geocode", address: address },
      });

      if (geoError) throw geoError;

      const features = geoData.location?.features;
      if (!features || features.length === 0) {
        throw new Error("Location not found. Please try a different address.");
      }

      const location = features[0];
      const [lon, lat] = location.geometry.coordinates;
      const formattedAddress = location.properties.formatted;
      
      setCurrentLocation(formattedAddress);
      onLocationChange(formattedAddress);

      // Create bounding box around the location (approximately 2km radius)
      const offset = 0.02; // roughly 2km
      const bbox = `${lon - offset},${lat - offset},${lon + offset},${lat + offset}`;

      // Now search for restaurants
      const { data: restaurantData, error: restError } = await supabase.functions.invoke("location-restaurants", {
        body: { action: "restaurants", bbox: bbox },
      });

      if (restError) throw restError;

      const restaurants: Restaurant[] = (restaurantData.restaurants?.features || []).map((feature: any, index: number) => ({
        id: feature.properties.place_id || `rest-${index}`,
        name: feature.properties.name || "Unknown Restaurant",
        address: feature.properties.formatted || feature.properties.address_line1 || "Address not available",
        categories: feature.properties.categories || [],
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        distance: feature.properties.distance,
      }));

      onRestaurantsFound(restaurants);
    } catch (err: any) {
      console.error("Location search error:", err);
      setError(err.message || "Failed to search location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocode to get address
          setAddress(`${latitude}, ${longitude}`);
          searchLocation();
        },
        (err) => {
          setError("Could not get your location. Please enter an address manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <NutriCard variant="elevated" className="p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          {currentLocation ? (
            <>
              <p className="text-xs text-muted-foreground">Delivering to</p>
              <p className="font-semibold text-sm line-clamp-1">{currentLocation}</p>
            </>
          ) : (
            <>
              <p className="font-semibold">Find Restaurants Near You</p>
              <p className="text-xs text-muted-foreground">Enter your location to see healthy options</p>
            </>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchLocation();
        }}
        className="space-y-3"
      >
        <div className="flex gap-2">
          <Input
            placeholder="Enter your address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={useCurrentLocation}
            disabled={isLoading}
            title="Use my location"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || !address.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Finding Restaurants...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Search This Location
            </>
          )}
        </Button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2"
        >
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      )}
    </NutriCard>
  );
}
