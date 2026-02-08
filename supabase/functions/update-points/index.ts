import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { action, taskType, pointsToDeduct } = await req.json();
    
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseAnon.auth.getClaims(token);
    if (authError || !data?.claims) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = data.claims.sub as string;

    console.log("[UPDATE-POINTS] Action:", action, "User:", userId);

    if (action === "complete_task") {
      const { data: newTotal, error } = await supabaseClient.rpc("add_task_points", {
        p_user_id: userId,
        p_task_type: taskType,
      });
      if (error) throw error;
      console.log("[UPDATE-POINTS] Task completed, new total:", newTotal);
      return new Response(JSON.stringify({ points: newTotal }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_streak") {
      const { data: streakData, error } = await supabaseClient.rpc("update_login_streak", {
        p_user_id: userId,
      });
      if (error) throw error;
      console.log("[UPDATE-POINTS] Streak updated:", streakData);
      return new Response(JSON.stringify({ streak: streakData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "deduct_points") {
      const { data: profile, error: fetchError } = await supabaseClient
        .from("profiles")
        .select("points")
        .eq("user_id", userId)
        .single();
      if (fetchError) throw fetchError;

      const newPoints = Math.max(0, (profile?.points || 0) - pointsToDeduct);
      const { error: updateError } = await supabaseClient
        .from("profiles")
        .update({ points: newPoints })
        .eq("user_id", userId);
      if (updateError) throw updateError;

      console.log("[UPDATE-POINTS] Points deducted, new total:", newPoints);
      return new Response(JSON.stringify({ points: newPoints }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_profile") {
      const { data: profile, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return new Response(JSON.stringify({ profile }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    console.error("[UPDATE-POINTS] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
