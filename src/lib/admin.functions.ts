import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

interface RegistroInsight {
  data: string | null;
  aero: string;
  quantidade: number;
  wo: string | null;
  estoque: string | null;
  parques: { nome: string };
  pecas: { sap: string; descricao: string };
}

/** Geração de insights por IA com base nas retiradas registradas. */
export const generateInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("IA indisponível: chave de acesso não configurada.");

    const { data, error } = await context.supabase
      .from("movimentacoes")
      .select(`data, aero, quantidade, wo, estoque, parques (nome), pecas (sap, descricao)`)
      .order("data", { ascending: false })
      .limit(400);
    if (error) throw new Error(error.message);

    const registros = (data ?? []).map((m: RegistroInsight) => ({
      data: m.data,
      parque: m.parques?.nome ?? "N/A",
      aero: m.aero,
      sap: m.pecas?.sap ?? "",
      peca: m.pecas?.descricao ?? "",
      quantidade: m.quantidade,
      wo: m.wo ?? "",
      estoque: m.estoque ?? "",
    }));

    if (registros.length === 0) {
      return { insights: "Ainda não há retiradas registradas para analisar." };
    }

    const prompt = `Você é um analista de manutenção de parques eólicos. Analise as retiradas de sobressalentes abaixo (JSON) e escreva em português do Brasil, em markdown, um relatório curto e objetivo com:

1. Resumo geral do consumo
2. Peças críticas (maior consumo e risco de ruptura)
3. Parques e aerogeradores com maior demanda
4. Tendências por período (dia/semana/mês)
5. Recomendações práticas de reposição e controle

Dados:
${JSON.stringify(registros)}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        input: prompt,
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 429)
        throw new Error("Muitas solicitações à IA. Tente novamente em instantes.");
      if (res.status === 402)
        throw new Error("Créditos de IA esgotados. Adicione créditos para continuar.");
      throw new Error(`Falha ao gerar insights (${res.status}).`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            text += evt.delta;
          } else if (evt.type === "response.completed" && !text && evt.response?.output_text) {
            text = Array.isArray(evt.response.output_text)
              ? evt.response.output_text.join("")
              : String(evt.response.output_text);
          }
        } catch {
          // ignora eventos não-JSON
        }
      }
    }

    return { insights: text.trim() || "A IA não retornou uma análise. Tente novamente." };
  });
