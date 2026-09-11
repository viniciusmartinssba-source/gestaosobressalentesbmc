import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BpbeoxIM.mjs";
import { n as objectType, r as stringType, t as numberType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DlpVJH7T.js
/** Cadastro de um novo material no catálogo (somente admin, garantido por RLS). */
var addMaterial_createServerFn_handler = createServerRpc({
	id: "88339309d2b23343f28f1a0637cdfd5dd541475747f99b1c0834dd25f1a449a0",
	name: "addMaterial",
	filename: "src/lib/admin.functions.ts"
}, (opts) => addMaterial.__executeServer(opts));
var addMaterial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	sap: stringType().trim().min(1),
	descricao: stringType().trim().min(1)
}).parse(data)).handler(addMaterial_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("pecas").upsert({
		sap: data.sap,
		descricao: data.descricao
	}, { onConflict: "sap" });
	if (error) throw new Error(error.message);
	return {
		sap: data.sap,
		descricao: data.descricao
	};
});
var updateMovimentacao_createServerFn_handler = createServerRpc({
	id: "4bf7302696455a8a83c5e45226bb8b13abb77b4171c8c5793a090aee59254c50",
	name: "updateMovimentacao",
	filename: "src/lib/admin.functions.ts"
}, (opts) => updateMovimentacao.__executeServer(opts));
var updateMovimentacao = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	parque_id: stringType().min(1),
	aero: stringType().min(1),
	sap: stringType().min(1),
	quantidade: numberType().int().min(1),
	wo: stringType().nullable(),
	estoque: stringType().nullable(),
	data: stringType().nullable()
}).parse(data)).handler(updateMovimentacao_createServerFn_handler, async ({ data, context }) => {
	const { id, ...fields } = data;
	const { data: row, error } = await context.supabase.from("movimentacoes").update({
		parque_id: fields.parque_id,
		aero: fields.aero,
		sap: fields.sap,
		quantidade: fields.quantidade,
		wo: fields.wo,
		estoque: fields.estoque,
		...fields.data ? { data: fields.data } : {}
	}).eq("id", id).select(`*, profiles (nome), parques (nome), pecas (sap, descricao)`).maybeSingle();
	if (error) throw new Error(error.message);
	if (!row) throw new Error("Lançamento não encontrado ou sem permissão para editar.");
	const m = row;
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
		estoque: m.estoque || ""
	};
});
var deleteMovimentacao_createServerFn_handler = createServerRpc({
	id: "3449d09ae6e3dcce870286f7af9d51b83017256c19e7a03ce9e166087ecf9e49",
	name: "deleteMovimentacao",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteMovimentacao.__executeServer(opts));
var deleteMovimentacao = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deleteMovimentacao_createServerFn_handler, async ({ data, context }) => {
	const { data: rows, error } = await context.supabase.from("movimentacoes").delete().eq("id", data.id).select("id");
	if (error) throw new Error(error.message);
	if (!rows || rows.length === 0) throw new Error("Lançamento não encontrado ou sem permissão para excluir.");
	return { id: data.id };
});
var generateInsights_createServerFn_handler = createServerRpc({
	id: "1c64b5260d4652aaa90293b5428727a77c5bf10b8b533dd6fe4f443e9ee6dfdc",
	name: "generateInsights",
	filename: "src/lib/admin.functions.ts"
}, (opts) => generateInsights.__executeServer(opts));
var generateInsights = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(generateInsights_createServerFn_handler, async ({ context }) => {
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) throw new Error("IA indisponível: chave de acesso não configurada.");
	const { data, error } = await context.supabase.from("movimentacoes").select(`data, aero, quantidade, wo, estoque, parques (nome), pecas (sap, descricao)`).order("data", { ascending: false }).limit(400);
	if (error) throw new Error(error.message);
	const registros = (data ?? []).map((m) => ({
		data: m.data,
		parque: m.parques?.nome ?? "N/A",
		aero: m.aero,
		sap: m.pecas?.sap ?? "",
		peca: m.pecas?.descricao ?? "",
		quantidade: m.quantidade,
		wo: m.wo ?? "",
		estoque: m.estoque ?? ""
	}));
	if (registros.length === 0) return { insights: "Ainda não há retiradas registradas para analisar." };
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
			"X-Lovable-AIG-SDK": "fetch"
		},
		body: JSON.stringify({
			model: "openai/gpt-6-astra",
			input: prompt,
			stream: true,
			reasoning: {
				effort: "low",
				summary: "auto"
			}
		})
	});
	if (!res.ok || !res.body) {
		if (res.status === 429) throw new Error("Muitas solicitações à IA. Tente novamente em instantes.");
		if (res.status === 402) throw new Error("Créditos de IA esgotados. Adicione créditos para continuar.");
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
				if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") text += evt.delta;
				else if (evt.type === "response.completed" && !text && evt.response?.output_text) text = Array.isArray(evt.response.output_text) ? evt.response.output_text.join("") : String(evt.response.output_text);
			} catch {}
		}
	}
	return { insights: text.trim() || "A IA não retornou uma análise. Tente novamente." };
});
//#endregion
export { addMaterial_createServerFn_handler, deleteMovimentacao_createServerFn_handler, generateInsights_createServerFn_handler, updateMovimentacao_createServerFn_handler };
