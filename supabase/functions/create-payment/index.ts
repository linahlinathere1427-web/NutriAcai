import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const { amount, redeemPoints, pointsToRedeem } = await req.json();
    
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    console.log("[CREATE-PAYMENT] Creating payment for user:", user.email);
    console.log("[CREATE-PAYMENT] Amount:", amount, "Redeem points:", redeemPoints, "Points to redeem:", pointsToRedeem);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Calculate discount from points (1000 points = $1 = 100 cents)
    let discountAmount = 0;
    if (redeemPoints && pointsToRedeem > 0) {
      discountAmount = Math.floor(pointsToRedeem / 1000) * 100; // cents
    }

    const finalAmount = Math.max(amount - discountAmount, 50); // Stripe minimum is 50 cents

    // Check if a Stripe customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create a checkout session with the calculated amount
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "NutriAcai Healthy Food Order",
              description: redeemPoints ? `Original: $${(amount / 100).toFixed(2)}, Points discount: -$${(discountAmount / 100).toFixed(2)}` : undefined,
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?points_used=${redeemPoints ? pointsToRedeem : 0}`,
      cancel_url: `${req.headers.get("origin")}/payment`,
      metadata: {
        user_id: user.id,
        points_redeemed: redeemPoints ? pointsToRedeem : 0,
        original_amount: amount,
        discount_amount: discountAmount,
      },
    });

    console.log("[CREATE-PAYMENT] Session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[CREATE-PAYMENT] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
