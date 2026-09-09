
INSERT INTO public.user_roles (user_id, role)
VALUES ('0b56c850-26ca-4311-a0d7-a3c34ffb1cd4', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

CREATE POLICY "Admins can update movimentacoes"
ON public.movimentacoes FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete movimentacoes"
ON public.movimentacoes FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert pecas"
ON public.pecas FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pecas"
ON public.pecas FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
