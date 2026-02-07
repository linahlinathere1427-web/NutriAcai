
CREATE OR REPLACE FUNCTION public.update_login_streak(p_user_id uuid)
RETURNS TABLE(new_streak integer, bonus_awarded integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_login TIMESTAMP WITH TIME ZONE;
  v_current_streak INTEGER;
  v_new_streak INTEGER;
  v_bonus INTEGER := 0;
BEGIN
  SELECT last_login, login_streak INTO v_last_login, v_current_streak
  FROM profiles WHERE user_id = p_user_id;

  IF v_last_login IS NULL OR (now() - v_last_login) > interval '48 hours' THEN
    v_new_streak := 1;
  ELSIF (now() - v_last_login) > interval '24 hours' THEN
    v_new_streak := COALESCE(v_current_streak, 0) + 1;
  ELSE
    v_new_streak := COALESCE(v_current_streak, 1);
  END IF;

  IF v_new_streak = 90 THEN
    v_bonus := 100;
  END IF;

  UPDATE profiles
  SET login_streak = v_new_streak,
      last_login = now(),
      points = points + v_bonus,
      updated_at = now()
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT v_new_streak, v_bonus;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_task_points(p_user_id uuid, p_task_type text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_points INTEGER;
  v_new_total INTEGER;
BEGIN
  IF p_task_type = 'daily' THEN v_points := 5;
  ELSIF p_task_type = 'weekly' THEN v_points := 10;
  ELSIF p_task_type = 'monthly' THEN v_points := 15;
  ELSE RAISE EXCEPTION 'Invalid task type: %', p_task_type;
  END IF;

  UPDATE profiles
  SET points = points + v_points, updated_at = now()
  WHERE user_id = p_user_id
  RETURNING points INTO v_new_total;

  RETURN v_new_total;
END;
$$;
