ALTER TABLE public.movimentacoes ADD COLUMN IF NOT EXISTS foto_url text;

DROP POLICY IF EXISTS "Technicians can upload their movimentacao photos" ON storage.objects;
CREATE POLICY "Technicians can upload their movimentacao photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'movimentacoes-fotos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Technicians can view their movimentacao photos" ON storage.objects;
CREATE POLICY "Technicians can view their movimentacao photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'movimentacoes-fotos' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin'::app_role)));