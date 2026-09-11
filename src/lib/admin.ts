import { supabase } from "@/integrations/supabase/client";
import type { HistoricoItem } from "@/lib/data";

interface MovimentacaoJoinRow {
  id: string;
  data: string;
  aero: string;
  sap: string;
  quantidade: number;
  wo: string | null;
  estoque: string | null;
  profiles: { nome: string } | null;
  parques: { nome: string } | null;
  pecas: { sap: string; descricao: string } | null;
}

/**
 * Operações administrativas executadas no navegador com a chave publicável.
 * A permissão é garantida pelas policies de RLS (somente admin).
 */

export async function addMaterial({ data }: { data: { sap: string; descricao: string } }) {
  const sap = data.sap.trim();
  const descricao = data.descricao.trim();
  if (!sap || !descricao) throw new Error("Informe o código SAP e a descrição do material.");

  const { error } = await supabase.from("pecas").upsert({ sap, descricao }, { onConflict: "sap" });
  if (error) throw new Error(error.message);
  return { sap, descricao };
}

export async function updateMovimentacao({
  data,
}: {
  data: {
    id: string;
    parque_id: string;
    aero: string;
    sap: string;
    quantidade: number;
    wo: string | null;
    estoque: string | null;
    data: string | null;
  };
}): Promise<HistoricoItem> {
  const { id, ...fields } = data;
  const { data: row, error } = await supabase
    .from("movimentacoes")
    .update({
      parque_id: fields.parque_id,
      aero: fields.aero,
      sap: fields.sap,
      quantidade: fields.quantidade,
      wo: fields.wo,
      estoque: fields.estoque,
      ...(fields.data ? { data: fields.data } : {}),
    })
    .eq("id", id)
    .select(`*, profiles (nome), parques (nome), pecas (sap, descricao)`)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!row) throw new Error("Lançamento não encontrado ou sem permissão para editar.");

  const m = row as unknown as MovimentacaoJoinRow;
  return {
    id: m.id,
    dataISO: m.data,
    data: new Date(m.data).toLocaleString("pt-BR"),
    tecnico: m.profiles?.nome || "Desconhecido",
    parque: m.parques?.nome || "N/A",
    aero: m.aero,
    sap: m.sap,
    peca: m.pecas?.descricao || "Desconhecida",
    quantidade: m.quantidade,
    wo: m.wo || "",
    estoque: m.estoque || "",
  };
}

export async function deleteMovimentacao({ data }: { data: { id: string } }) {
  const { data: rows, error } = await supabase
    .from("movimentacoes")
    .delete()
    .eq("id", data.id)
    .select("id");
  if (error) throw new Error(error.message);
  if (!rows || rows.length === 0) {
    throw new Error("Lançamento não encontrado ou sem permissão para excluir.");
  }
  return { id: data.id };
}
