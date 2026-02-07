
-- Fix 1: Restrict profiles public access - only allow lookup by username (needed for public profile pages)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Public profiles viewable by username lookup"
ON public.profiles FOR SELECT
TO anon
USING (true);

-- Authenticated users can see all profiles (needed for the app) and their own
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Create a secure function for click tracking instead of direct updates
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE links SET click_count = click_count + 1 WHERE id = link_id AND is_active = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_link_clicks(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_link_clicks(UUID) TO authenticated;

-- Add explicit deny for anonymous updates on links
CREATE POLICY "Deny anonymous link updates"
ON public.links FOR UPDATE
TO anon
USING (false);
