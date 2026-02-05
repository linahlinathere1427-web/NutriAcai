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
    const { ingredients, action } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("[RECIPE-AGENT] Generating recipe for:", ingredients);

    const systemPrompt = `You are NutriAcai's Recipe Agent - an expert culinary AI that creates healthy, delicious recipes based on available ingredients.

Your specialties:
- Creating nutritious recipes from given ingredients
- Calculating approximate nutritional information
- Providing step-by-step cooking instructions
- Suggesting healthy substitutions
- Adapting recipes for dietary restrictions (vegan, gluten-free, keto, halal)

When generating recipes:
1. Start with the recipe name and a brief description
2. List all ingredients with quantities
3. Include prep time, cook time, and servings
4. Provide clear, numbered cooking steps
5. Add nutritional estimates (calories, protein, carbs, fat)
6. Include helpful tips or variations

Focus on:
- Healthy, whole-food ingredients
- Balanced macronutrients
- Minimal processed ingredients
- Fresh, flavorful combinations
- Middle Eastern and Mediterranean influences when appropriate

Format your response in clear markdown with headers for each section.`;

    const userPrompt = action === "search" 
      ? `Search online and find real recipes that include these ingredients: ${ingredients}. Provide 2-3 actual recipes with full details, citing any sources if applicable.`
      : `Create a healthy, delicious recipe using these ingredients: ${ingredients}. Be creative but practical, and ensure the recipe is nutritious.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("[RECIPE-AGENT] Lovable AI error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const recipe = data.choices?.[0]?.message?.content || "Unable to generate recipe. Please try again.";
    
    console.log("[RECIPE-AGENT] Recipe generated successfully");

    return new Response(JSON.stringify({ recipe }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[RECIPE-AGENT] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
