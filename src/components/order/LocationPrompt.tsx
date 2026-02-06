import { motion } from "framer-motion";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { useState } from "react";
import { useLocation } from "@/contexts/LocationContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { supabase } from "@/integrations/supabase/client";

interface LocationPromptProps {
  onLocationSet: () => void;
}

export function LocationPrompt({ onLocationSet }: LocationPromptProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { detectLocation, setLocation, setHasAskedLocation } = useLocation();
  const { setCurrency } = useCart();

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    try {
      await detectLocation();
      setHasAskedLocation(true);
      onLocationSet();
    } catch (error) {
      console.error("Auto detect failed:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualSearch = async () => {
    if (!manualAddress.trim()) return;
    
    setIsSearching(true);
    try {
      const { data: geoData, error: geoError } = await supabase.functions.invoke("location-restaurants", {
        body: { action: "geocode", address: manualAddress },
      });

      if (geoError) throw geoError;

      const feature = geoData.location?.features?.[0];
      if (feature) {
        const props = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;
        const countryCode = props.country_code?.toUpperCase() || "AE";
        
        // Country to currency mapping
        const currencyMap: Record<string, string> = {
          AE: "AED", SA: "SAR", US: "USD", GB: "GBP", IN: "INR",
          PK: "PKR", EG: "EGP", QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR",
        };

        const locationData = {
          country: props.country || "United Arab Emirates",
          countryCode,
          city: props.city || props.state || "Dubai",
          currency: currencyMap[countryCode] || "USD",
          lat,
          lon,
          address: props.formatted || manualAddress,
        };

        setLocation(locationData);
        setCurrency(locationData.currency);
        setHasAskedLocation(true);
        onLocationSet();
      }
    } catch (error) {
      console.error("Manual search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <NutriCard variant="gradient" className="p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8" />
          </div>
          
          <h2 className="font-display text-2xl font-bold mb-2">Where are you?</h2>
          <p className="text-sm opacity-80 mb-6">
            We'll show you restaurants and prices based on your location
          </p>

          <div className="space-y-4">
            <Button
              variant="secondary"
              className="w-full h-14"
              onClick={handleAutoDetect}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Detecting location...
                </>
              ) : (
                <>
                  <Navigation className="h-5 w-5 mr-2" />
                  Use My Current Location
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-primary px-2 text-primary-foreground/70">or</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter your address..."
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              />
              <Button
                variant="secondary"
                className="h-12 px-6"
                onClick={handleManualSearch}
                disabled={isSearching || !manualAddress.trim()}
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Go"}
              </Button>
            </div>
          </div>
        </NutriCard>
      </motion.div>
    </div>
  );
}
