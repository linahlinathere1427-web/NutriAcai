import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID_ACTIONS = ["geocode", "reverse_geocode", "restaurants"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, address, bbox, lat, lon } = body;

    // Validate action
    if (!action || typeof action !== "string" || !VALID_ACTIONS.includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid action. Use 'geocode', 'reverse_geocode', or 'restaurants'" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const MAP_API_KEY = Deno.env.get("MAP_API_KEY");
    if (!MAP_API_KEY) {
      throw new Error("MAP_API_KEY is not configured");
    }

    if (action === "geocode") {
      // Validate address
      if (!address || typeof address !== "string" || address.trim().length === 0 || address.length > 300) {
        return new Response(JSON.stringify({ error: "Invalid address: must be a non-empty string under 300 characters" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("[LOCATION] Geocoding address:", address.substring(0, 50));
      
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
      // Validate lat/lon
      const latNum = Number(lat);
      const lonNum = Number(lon);
      if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
        return new Response(JSON.stringify({ error: "Invalid coordinates: lat must be -90 to 90, lon must be -180 to 180" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("[LOCATION] Reverse geocoding:", latNum, lonNum);
      
      const reverseUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latNum}&lon=${lonNum}&apiKey=${MAP_API_KEY}`;
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
      // Validate bbox format: "lon1,lat1,lon2,lat2"
      if (!bbox || typeof bbox !== "string") {
        return new Response(JSON.stringify({ error: "Invalid bbox parameter" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const bboxRegex = /^-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*$/;
      if (!bboxRegex.test(bbox)) {
        return new Response(JSON.stringify({ error: "Invalid bbox format. Expected: lon1,lat1,lon2,lat2" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("[LOCATION] Finding restaurants in bbox");
      
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

    return new Response(JSON.stringify({ error: "Unhandled action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[LOCATION] Error:", error);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
