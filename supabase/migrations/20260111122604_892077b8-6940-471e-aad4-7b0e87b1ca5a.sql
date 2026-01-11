-- Add theme_song_url column to profiles table for storing the user's theme song
ALTER TABLE public.profiles ADD COLUMN theme_song_url TEXT DEFAULT NULL;