-- 1. Fix user_roles policies
create policy "Users can view their own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

-- 2. Secure has_role function
-- Revoke all permissions first
revoke all on function public.has_role(uuid, app_role) from public;
revoke all on function public.has_role(uuid, app_role) from anon;
revoke all on function public.has_role(uuid, app_role) from authenticated;

-- Grant execute only to authenticated and service_role
grant execute on function public.has_role(uuid, app_role) to authenticated;
grant execute on function public.has_role(uuid, app_role) to service_role;

-- 3. Automation for Profiles and Roles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Create profile
  insert into public.profiles (id, nome, matricula, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'full_name', 'Novo Técnico'),
    coalesce(new.raw_user_meta_data->>'matricula', 'TEMP-' || substr(new.id::text, 1, 8)),
    new.email
  );

  -- Assign default technician role
  insert into public.user_roles (user_id, role)
  values (new.id, 'technician');

  return new;
end;
$$;

-- Trigger to run handle_new_user on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
