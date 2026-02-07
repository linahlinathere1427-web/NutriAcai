
-- Add auth.uid() validation to update_login_streak
CREATE OR REPLACE FUNCTION public.update_login_streak(p_user_id uuid)
 RETURNS TABLE(new_streak integer, bonus_awarded integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_last_login TIMESTAMP WITH TIME ZONE;
  v_hours_diff NUMERIC;
  v_current_streak INT;
  v_bonus INT := 0;
BEGIN
  -- Verify caller owns this profile
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: cannot update other users profiles';
  END IF;

  SELECT last_login, login_streak INTO v_last_login, v_current_streak
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  v_hours_diff := EXTRACT(EPOCH FROM (now() - v_last_login)) / 3600;
  
  IF v_hours_diff >= 24 AND v_hours_diff < 48 THEN
    v_current_streak := v_current_streak + 1;
    IF v_current_streak = 90 THEN
      v_bonus := 100;
    END IF;
  ELSIF v_hours_diff >= 48 THEN
    v_current_streak := 1;
  END IF;
  
  UPDATE public.profiles
  SET 
    last_login = now(),
    login_streak = v_current_streak,
    points = points + v_bonus
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT v_current_streak, v_bonus;
END;
$function$;

-- Add auth.uid() validation to add_task_points
CREATE OR REPLACE FUNCTION public.add_task_points(p_user_id uuid, p_task_type text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_points INT;
  v_new_total INT;
BEGIN
  -- Verify caller owns this profile
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify other users points';
  END IF;

  CASE p_task_type
    WHEN 'daily' THEN v_points := 5;
    WHEN 'weekly' THEN v_points := 10;
    WHEN 'monthly' THEN v_points := 15;
    ELSE v_points := 0;
  END CASE;
  
  UPDATE public.profiles
  SET points = points + v_points
  WHERE user_id = p_user_id
  RETURNING points INTO v_new_total;
  
  RETURN v_new_total;
END;
$function$;
