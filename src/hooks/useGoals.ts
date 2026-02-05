import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_value: number | null;
  current_value: number | null;
  unit: string | null;
  period: "daily" | "weekly" | "monthly";
  created_at: string;
  updated_at: string;
}

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals((data as Goal[]) || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    try {
      const { error } = await supabase
        .from("goals")
        .update({ current_value: newValue })
        .eq("id", goalId);

      if (error) throw error;
      await fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) throw error;
      await fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    isLoading,
    fetchGoals,
    updateGoalProgress,
    deleteGoal,
  };
}
