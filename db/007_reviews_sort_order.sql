-- Migration to add sort_order to reviews
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Optional: set initial sort_order to reflect current created_at order
-- But DEFAULT 0 is fine, they can reorder in UI.
