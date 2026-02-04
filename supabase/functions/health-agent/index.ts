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
    const { message } = await req.json();
    
    const AIRIA_API_KEY = Deno.env.get("AIRIA_API_KEY");
    if (!AIRIA_API_KEY) {
      throw new Error("AIRIA_API_KEY is not configured");
    }

    console.log("[HEALTH-AGENT] Sending message to AIRIA:", message);

    const response = await fetch(
      "https://api.airia.ai/v2/PipelineExecution/5006d97b-9279-421d-a686-207cb7539b91",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AIRIA_API_KEY,
        },
        body: JSON.stringify({
          input: message,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[HEALTH-AGENT] AIRIA API error:", response.status, errorText);
      throw new Error(`AIRIA API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("[HEALTH-AGENT] AIRIA response received");

    return new Response(JSON.stringify({ response: data.result || data.output || data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
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
