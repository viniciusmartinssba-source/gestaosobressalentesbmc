import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { t as supabase } from "./client-Cf7aHSwH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data.functions-BehWaI_o.js
var getInitialData_createServerFn_handler = createServerRpc({
	id: "1b9b7a2e863e1df16d7f1cf8c87021209fb01a21c0e1dfabc96d32ae4111d407",
	name: "getInitialData",
	filename: "src/lib/data.functions.ts"
}, (opts) => getInitialData.__executeServer(opts));
var getInitialData = createServerFn({ method: "GET" }).handler(getInitialData_createServerFn_handler, async () => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const [parquesRes, profilesRes] = await Promise.all([supabaseAdmin.from("parques").select("*").order("nome"), supabaseAdmin.from("profiles").select("id, nome, matricula, email").order("nome")]);
	if (parquesRes.error) throw parquesRes.error;
	if (profilesRes.error) throw profilesRes.error;
	const catalogo = [];
	const PAGE = 1e3;
	for (let from = 0;; from += PAGE) {
		const { data, error } = await supabaseAdmin.from("pecas").select("sap, descricao").order("descricao").range(from, from + PAGE - 1);
		if (error) throw error;
		catalogo.push(...data || []);
		if (!data || data.length < PAGE) break;
	}
	return {
		parques: parquesRes.data || [],
		estoques: ["1670", "1673"],
		catalogo,
		tecnicos: profilesRes.data || []
	};
});
var getHistory_createServerFn_handler = createServerRpc({
	id: "b40ab88bc600f5455d5a482309a825f068a7484688f403397cdb05c38b6e1fbc",
	name: "getHistory",
	filename: "src/lib/data.functions.ts"
}, (opts) => getHistory.__executeServer(opts));
var getHistory = createServerFn({ method: "GET" }).handler(getHistory_createServerFn_handler, async () => {
	const { data, error } = await supabase.from("movimentacoes").select(`
      *,
      profiles (nome),
      parques (nome),
      pecas (sap, descricao)
    `).order("data", { ascending: false });
	if (error) throw error;
	return data.map((m) => ({
		id: m.id,
		data: new Date(m.data).toLocaleString("pt-BR"),
		tecnico: m.profiles?.nome || "Desconhecido",
		parque: m.parques?.nome || "N/A",
		aero: m.aero,
		sap: m.sap,
		peca: m.pecas?.descricao || "Desconhecida",
		quantidade: m.quantidade,
		wo: m.wo || "",
		estoque: m.estoque || ""
	}));
});
//#endregion
export { getHistory_createServerFn_handler, getInitialData_createServerFn_handler };
