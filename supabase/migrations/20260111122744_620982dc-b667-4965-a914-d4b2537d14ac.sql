-- Create storage bucket for theme songs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('theme-songs', 'theme-songs', true, 5242880, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm']);

-- Create policy to allow authenticated users to upload their own theme songs
CREATE POLICY "Users can upload their own theme songs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'theme-songs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to update their own theme songs
CREATE POLICY "Users can update their own theme songs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'theme-songs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to delete their own theme songs
CREATE POLICY "Users can delete their own theme songs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'theme-songs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow public access to view theme songs
CREATE POLICY "Theme songs are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'theme-songs');