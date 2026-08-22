CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  review_text TEXT NOT NULL,
  reviewer_role TEXT,
  is_local_guide BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.reviews FOR SELECT USING (true);

INSERT INTO public.reviews (reviewer_name, rating, review_text, reviewer_role, is_local_guide) VALUES
('Sofia', 5, 'Service excellent..sepeda bs diambl dirumah (area ungaran) dan diantar lagi kl sdh seleaai service. pengerjaan sangat cepat dan baik.', NULL, true),
('Sofian Hadi', 5, 'Solutif, biaya terjangkau sesuai pekerjaan, part yg masih bisa dibenerin gak perlu asal ganti. Hasil maksimal. Bahkan kalau dekat beliau mau anterin sepedanya ke rumah.', 'Fiandigital', false),
('Titik Suryani', 5, 'Alhamdulillah fast respon banget & biayanya juga bisa dibilang murah banget. Itu rumahku di Dampu, tapi bapaknya mau dateng. Pelayanannya juga ramah banget.', NULL, true);