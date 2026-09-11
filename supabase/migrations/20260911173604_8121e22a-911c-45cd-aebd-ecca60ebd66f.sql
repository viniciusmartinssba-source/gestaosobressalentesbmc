CREATE OR REPLACE FUNCTION public.email_por_matricula(_matricula text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles
  WHERE lower(matricula) = lower(trim(_matricula))
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.email_por_matricula(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_por_matricula(text) TO anon, authenticated;