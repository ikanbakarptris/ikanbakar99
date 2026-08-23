CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  whatsapp TEXT,
  menu_favorit TEXT NOT NULL,
  tingkat_pedas TEXT NOT NULL,
  saran TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Warga bisa mengisi kuesioner (INSERT) secara publik
DROP POLICY IF EXISTS "Public can insert survey responses" ON public.survey_responses;
CREATE POLICY "Public can insert survey responses"
  ON public.survey_responses FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Hanya Admin yang bisa melihat data (SELECT)
DROP POLICY IF EXISTS "Authenticated can read survey responses" ON public.survey_responses;
CREATE POLICY "Authenticated can read survey responses"
  ON public.survey_responses FOR SELECT TO authenticated USING (true);
  
-- Supaya PostgREST merefresh cache schema
NOTIFY pgrst, 'reload schema';
