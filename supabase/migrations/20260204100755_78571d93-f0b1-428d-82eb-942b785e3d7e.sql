-- Create profiles table with gamification fields
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 0,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),
  login_streak INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create function to update streak and award bonus
CREATE OR REPLACE FUNCTION public.update_login_streak(p_user_id UUID)
RETURNS TABLE(new_streak INT, bonus_awarded INT) AS $$
DECLARE
  v_last_login TIMESTAMP WITH TIME ZONE;
  v_hours_diff NUMERIC;
  v_current_streak INT;
  v_bonus INT := 0;
BEGIN
  SELECT last_login, login_streak INTO v_last_login, v_current_streak
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  v_hours_diff := EXTRACT(EPOCH FROM (now() - v_last_login)) / 3600;
  
  -- If 24-48 hours since last login, increment streak
  IF v_hours_diff >= 24 AND v_hours_diff < 48 THEN
    v_current_streak := v_current_streak + 1;
    
    -- Award 100 bonus points for 90-day streak
    IF v_current_streak = 90 THEN
      v_bonus := 100;
    END IF;
  ELSIF v_hours_diff >= 48 THEN
    -- Reset streak if more than 48 hours
    v_current_streak := 1;
  END IF;
  
  -- Update profile
  UPDATE public.profiles
  SET 
    last_login = now(),
    login_streak = v_current_streak,
    points = points + v_bonus
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT v_current_streak, v_bonus;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to add points for task completion
CREATE OR REPLACE FUNCTION public.add_task_points(p_user_id UUID, p_task_type TEXT)
RETURNS INT AS $$
DECLARE
  v_points INT;
  v_new_total INT;
BEGIN
  -- Determine points based on task type
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;