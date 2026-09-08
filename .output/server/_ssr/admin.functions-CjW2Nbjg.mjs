import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { n as objectType, r as stringType, t as booleanType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-CjW2Nbjg.js
var importMaterials_createServerFn_handler = createServerRpc({
	id: "c63d92fa0ea7bb319a7019b8c78a277278a375c24cff1811ec3d10fbb3b3e240",
	name: "importMaterials",
	filename: "src/lib/admin.functions.ts"
}, (opts) => importMaterials.__executeServer(opts));
var importMaterials = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	csvData: stringType(),
	clearExisting: booleanType().default(false)
}).parse(data)).handler(importMaterials_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const pecas = data.csvData.split("\n").map((line) => {
		const parts = line.split(/[;,\t]/);
		if (parts.length < 2) return null;
		const sap = parts[0]?.trim();
		const descricao = parts.slice(1).join(" ").trim();
		if (!sap || !descricao) return null;
		return {
			sap,
			descricao
		};
	}).filter(Boolean);
	if (pecas.length === 0) throw new Error("Nenhum dado válido encontrado para importação.");
	if (data.clearExisting) await supabaseAdmin.from("pecas").delete().neq("sap", "0");
	const { error } = await supabaseAdmin.from("pecas").upsert(pecas, { onConflict: "sap" });
	if (error) throw error;
	return { importedCount: pecas.length };
});
//#endregion
export { importMaterials_createServerFn_handler };
