import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const getInitialData = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  
  const [parquesRes, profilesRes] = await Promise.all([
    supabaseAdmin.from('parques').select('*').order('nome'),
    supabaseAdmin.from('profiles').select('id, nome, matricula, email').order('nome')
  ]);

  if (parquesRes.error) throw parquesRes.error;
  if (profilesRes.error) throw profilesRes.error;

  // pecas can exceed the 1000-row API limit: fetch in pages, minimal columns
  const catalogo: { sap: string; descricao: string }[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabaseAdmin
      .from('pecas')
      .select('sap, descricao')
      .order('descricao')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    catalogo.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }

  return {
    parques: parquesRes.data || [],
    estoques: ["1670", "1673"],
    catalogo,
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
    wo: m.wo || '',
    estoque: m.estoque || ''
  }));
});
