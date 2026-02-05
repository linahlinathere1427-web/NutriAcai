import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Profile {
  id: string;
  user_id: string;
  points: number;
  last_login: string;
  login_streak: number;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("update-points", {
        body: { action: "get_profile" },
      });

      if (error) throw error;
      setProfile(data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateStreak = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke("update-points", {
        body: { action: "update_streak" },
      });

      if (error) throw error;
      
      // Refresh profile after streak update
      await fetchProfile();
      
      return data.streak;
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  }, [user, fetchProfile]);

  const addTaskPoints = useCallback(async (taskType: "daily" | "weekly" | "monthly") => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke("update-points", {
        body: { action: "complete_task", taskType },
      });

      if (error) throw error;
      
      // Update local state
      setProfile((prev) => prev ? { ...prev, points: data.points } : null);
      
      return data.points;
    } catch (error) {
      console.error("Error adding points:", error);
    }
  }, [user]);

  const deductPoints = useCallback(async (pointsToDeduct: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke("update-points", {
        body: { action: "deduct_points", pointsToDeduct },
      });

      if (error) throw error;
      
      // Update local state
      setProfile((prev) => prev ? { ...prev, points: data.points } : null);
      
      return data.points;
    } catch (error) {
      console.error("Error deducting points:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update streak on initial load
  useEffect(() => {
    if (user && profile) {
      updateStreak();
    }
  }, [user]);

  return {
    profile,
    isLoading,
    fetchProfile,
    refetchProfile: fetchProfile,
    updateStreak,
    addTaskPoints,
    deductPoints,
    points: profile?.points ?? 0,
    streak: profile?.login_streak ?? 0,
  };
}
