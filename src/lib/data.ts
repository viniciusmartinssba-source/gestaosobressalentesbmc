import { supabase } from "@/integrations/supabase/client";

export interface HistoricoItem {
  id: string;
  dataISO: string;
  data: string;
  tecnico: string;
  parque: string;
  aero: string;
  sap: string;
  peca: string;
  quantidade: number;
  wo: string;
  estoque: string;
}

interface MovimentacaoRow {
  id: string;
  data: string | null;
  aero: string;
  sap: string;
  quantidade: number;
  wo: string | null;
  estoque: string | null;
  profiles: { nome: string } | null;
  parques: { nome: string } | null;
  pecas: { sap: string; descricao: string } | null;
}

export interface Parque {
  id: string;
  nome: string;
  aeros: number[];
}

/**
 * Dados básicos do painel. Executa no navegador com a chave publicável;
 * o acesso é controlado exclusivamente pelas policies de RLS do Supabase.
 */
export async function getInitialData() {
  const parquesRes = await supabase.from("parques").select("*").order("nome");
  if (parquesRes.error) throw parquesRes.error;

  // O catálogo pode passar do limite de 1000 linhas da API: busca paginada.
  const catalogo: { sap: string; descricao: string }[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("pecas")
      .select("sap, descricao")
      .order("descricao")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    catalogo.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }

  return {
    parques: (parquesRes.data || []) as Parque[],
    estoques: ["1670", "1673"],
    catalogo,
  };
}

/** Histórico de retiradas. RLS: técnico vê as próprias, admin vê todas. */
export async function getHistory(): Promise<HistoricoItem[]> {
  const { data, error } = await supabase
    .from("movimentacoes")
    .select(
      `
      *,
      profiles (nome),
      parques (nome),
      pecas (sap, descricao)
    `,
    )
    .order("data", { ascending: false })
    .limit(1000);

  if (error) throw error;

  return (data ?? []).map((m: MovimentacaoRow) => ({
    id: m.id,
    dataISO: m.data || new Date().toISOString(),
    data: new Date(m.data || Date.now()).toLocaleString("pt-BR"),
    tecnico: m.profiles?.nome || "Desconhecido",
    parque: m.parques?.nome || "N/A",
    aero: m.aero,
    sap: m.sap,
    peca: m.pecas?.descricao || "Desconhecida",
    quantidade: m.quantidade,
    wo: m.wo || "",
    estoque: m.estoque || "",
  }));
}
