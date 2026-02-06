import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LocationData {
  country: string;
  countryCode: string;
  city: string;
  currency: string;
  lat: number;
  lon: number;
  address: string;
}

interface LocationContextType {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  hasAskedLocation: boolean;
  setHasAskedLocation: (value: boolean) => void;
  detectLocation: () => Promise<void>;
  setLocation: (location: LocationData) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Country to currency mapping
const countryCurrencyMap: Record<string, string> = {
  AE: "AED",
  SA: "SAR",
  US: "USD",
  GB: "GBP",
  IN: "INR",
  PK: "PKR",
  EG: "EGP",
  QA: "QAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  // Add more as needed
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAskedLocation, setHasAskedLocation] = useState(false);

  // Load saved location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem("nutriacai_location");
    const hasAsked = localStorage.getItem("nutriacai_asked_location");
    
    if (savedLocation) {
      try {
        setLocationState(JSON.parse(savedLocation));
      } catch (e) {
        console.error("Failed to parse saved location:", e);
      }
    }
    
    if (hasAsked === "true") {
      setHasAskedLocation(true);
    }
  }, []);

  const setLocation = (loc: LocationData) => {
    setLocationState(loc);
    localStorage.setItem("nutriacai_location", JSON.stringify(loc));
  };

  const detectLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try GPS first
      if ("geolocation" in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes cache
          });
        });

        const { latitude, longitude } = position.coords;

        // Reverse geocode to get address
        const { data: geoData, error: geoError } = await supabase.functions.invoke("location-restaurants", {
          body: { action: "reverse_geocode", lat: latitude, lon: longitude },
        });

        if (geoError) throw geoError;

        const feature = geoData.location?.features?.[0];
        if (feature) {
          const props = feature.properties;
          const countryCode = props.country_code?.toUpperCase() || "AE";
          
          const locationData: LocationData = {
            country: props.country || "United Arab Emirates",
            countryCode,
            city: props.city || props.state || "Dubai",
            currency: countryCurrencyMap[countryCode] || "USD",
            lat: latitude,
            lon: longitude,
            address: props.formatted || `${latitude}, ${longitude}`,
          };

          setLocation(locationData);
          return;
        }
      }

      // Fallback to IP-based geolocation
      const response = await fetch("https://ipapi.co/json/");
      const ipData = await response.json();
      
      const countryCode = ipData.country_code || "AE";
      const locationData: LocationData = {
        country: ipData.country_name || "United Arab Emirates",
        countryCode,
        city: ipData.city || "Dubai",
        currency: countryCurrencyMap[countryCode] || "USD",
        lat: ipData.latitude || 25.2048,
        lon: ipData.longitude || 55.2708,
        address: `${ipData.city || "Dubai"}, ${ipData.country_name || "UAE"}`,
      };

      setLocation(locationData);
    } catch (err: any) {
      console.error("Location detection error:", err);
      setError("Could not detect your location. Please enter it manually.");
      
      // Set default to Dubai
      setLocation({
        country: "United Arab Emirates",
        countryCode: "AE",
        city: "Dubai",
        currency: "AED",
        lat: 25.2048,
        lon: 55.2708,
        address: "Dubai, UAE",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetHasAskedLocation = (value: boolean) => {
    setHasAskedLocation(value);
    localStorage.setItem("nutriacai_asked_location", value.toString());
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        error,
        hasAskedLocation,
        setHasAskedLocation: handleSetHasAskedLocation,
        detectLocation,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
