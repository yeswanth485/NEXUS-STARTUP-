-- Supabase Storage Buckets for Nexus Platform
-- Safe to re-run (idempotent)

-- 1. Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('portfolio', 'portfolio', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']),
  ('attachments', 'attachments', false, 52428800, ARRAY['image/png','image/jpeg','image/webp','image/gif','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/zip','text/plain']),
  ('pitchdecks', 'pitchdecks', false, 104857600, ARRAY['application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'])
ON CONFLICT (id) DO NOTHING;

-- 2. RLS: avatars
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. RLS: portfolio
DROP POLICY IF EXISTS "Portfolio items are publicly accessible" ON storage.objects;
CREATE POLICY "Portfolio items are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Freelancers can upload portfolio items" ON storage.objects;
CREATE POLICY "Freelancers can upload portfolio items"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Freelancers can update their portfolio items" ON storage.objects;
CREATE POLICY "Freelancers can update their portfolio items"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Freelancers can delete their portfolio items" ON storage.objects;
CREATE POLICY "Freelancers can delete their portfolio items"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. RLS: attachments
DROP POLICY IF EXISTS "Attachments are accessible by project participants" ON storage.objects;
CREATE POLICY "Attachments are accessible by project participants"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'attachments'
    AND auth.role() = 'authenticated'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.project_id::text = (storage.foldername(name))[2]
        AND auth.uid() = ANY(c.participant_ids)
      )
    )
  );

DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'attachments'
    AND auth.role() = 'authenticated'
  );

-- 5. RLS: pitchdecks
DROP POLICY IF EXISTS "Pitchdecks are accessible by the owner" ON storage.objects;
CREATE POLICY "Pitchdecks are accessible by the owner"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pitchdecks'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Startups can upload pitchdecks" ON storage.objects;
CREATE POLICY "Startups can upload pitchdecks"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pitchdecks'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Startups can update their pitchdecks" ON storage.objects;
CREATE POLICY "Startups can update their pitchdecks"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'pitchdecks'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Startups can delete their pitchdecks" ON storage.objects;
CREATE POLICY "Startups can delete their pitchdecks"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pitchdecks'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
