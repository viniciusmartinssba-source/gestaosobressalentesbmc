alter table public.movimentacoes drop constraint movimentacoes_tecnico_id_fkey;
alter table public.movimentacoes add constraint movimentacoes_tecnico_id_fkey 
  foreign key (tecnico_id) references public.profiles(id);
