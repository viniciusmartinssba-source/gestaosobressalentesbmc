import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const getInitialData = createServerFn({ method: "GET" }).handler(async () => {
  const [parquesRes, pecasRes, profilesRes] = await Promise.all([
    supabase.from('parques').select('*').order('nome'),
    supabase.from('pecas').select('*').order('descricao'),
    supabase.from('profiles').select('*').order('nome')
  ]);

  if (parquesRes.error) throw parquesRes.error;
  if (pecasRes.error) throw pecasRes.error;
  if (profilesRes.error) throw profilesRes.error;

  return {
    parques: parquesRes.data || [],
    estoques: ["1670", "1673"],
    catalogo: pecasRes.data || [],
    tecnicos: profilesRes.data || [],
  };
});

export const getHistory = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from('movimentacoes')
    .select(`
      *,
      profiles (nome),
      parques (nome),
      pecas (sap, descricao)
    `)
    .order('data', { ascending: false });

  if (error) throw error;

  return data.map(m => ({
    id: m.id,
    data: new Date(m.data!).toLocaleString('pt-BR'),
    tecnico: m.profiles?.nome || 'Desconhecido',
    parque: m.parques?.nome || 'N/A',
    aero: m.aero,
    sap: m.sap,
    peca: m.pecas?.descricao || 'Desconhecida',
    quantidade: m.quantidade,
    wo: m.wo,
    estoque: m.estoque
  }));
});
