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
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("[HEALTH-AGENT] Processing chat with Lovable AI");

    const systemPrompt = `You are NutriAcai's Health Agent - a friendly, knowledgeable wellness coach specializing in nutrition, fitness, and healthy lifestyle guidance.

Your expertise includes:
- Personalized nutrition advice and meal planning
- Exercise recommendations for all fitness levels
- Weight management strategies
- Healthy habit formation
- Sleep optimization
- Stress management techniques
- Understanding of Dubai's health and wellness scene

Guidelines:
- Be encouraging, supportive, and non-judgmental
- Provide practical, actionable advice
- Consider cultural dietary preferences (halal options, regional cuisine)
- Recommend NutriAcai features when relevant (recipes, healthy ordering, point rewards)
- Keep responses concise but informative
- Always encourage consulting healthcare professionals for medical concerns

Remember: You're helping users on their wellness journey, celebrating their progress, and motivating them toward healthier choices.`;

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
          ...messages,
        ],
        stream: true,
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
      console.error("[HEALTH-AGENT] Lovable AI error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("[HEALTH-AGENT] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
