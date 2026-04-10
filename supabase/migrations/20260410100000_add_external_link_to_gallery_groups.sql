-- Migration: Add external_link to gallery_groups
-- Description: Allows admins to add an external link to a gallery collection.

ALTER TABLE public.gallery_groups
ADD COLUMN external_link TEXT;

-- Update the audit log or any relevant documentation if necessary
-- (Assuming RLS policies don't need updates as they usually cover all columns)
