import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, address, bbox, lat, lon } = await req.json();
    
    const MAP_API_KEY = Deno.env.get("MAP_API_KEY");
    if (!MAP_API_KEY) {
      throw new Error("MAP_API_KEY is not configured");
    }

    if (action === "geocode") {
      // Geocode an address to get coordinates
      console.log("[LOCATION] Geocoding address:", address);
      
      const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${MAP_API_KEY}`;
      const response = await fetch(geocodeUrl);
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("[LOCATION] Geocoding result:", data.features?.length, "results");
      
      return new Response(JSON.stringify({ location: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "reverse_geocode") {
      // Reverse geocode coordinates to get address
      console.log("[LOCATION] Reverse geocoding:", lat, lon);
      
      const reverseUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${MAP_API_KEY}`;
      const response = await fetch(reverseUrl);
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("[LOCATION] Reverse geocoding result:", data.features?.length, "results");
      
      return new Response(JSON.stringify({ location: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    if (action === "restaurants") {
      // Find restaurants/food places near a bounding box
      console.log("[LOCATION] Finding restaurants in bbox:", bbox);
      
      // Use catering.restaurant category for restaurants
      const placesUrl = `https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.fast_food,catering.cafe&filter=rect:${bbox}&limit=20&apiKey=${MAP_API_KEY}`;
      const response = await fetch(placesUrl);
      
      if (!response.ok) {
        throw new Error(`Places search failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("[LOCATION] Found", data.features?.length, "restaurants");
      
      return new Response(JSON.stringify({ restaurants: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Invalid action. Use 'geocode', 'reverse_geocode', or 'restaurants'");
  } catch (error) {
    console.error("[LOCATION] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
