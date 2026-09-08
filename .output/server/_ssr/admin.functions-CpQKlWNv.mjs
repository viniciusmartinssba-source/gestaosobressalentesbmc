import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as objectType, r as stringType, t as booleanType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DKvxGDvJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-CpQKlWNv.js
var importMaterials = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	csvData: stringType(),
	clearExisting: booleanType().default(false)
}).parse(data)).handler(createSsrRpc("c63d92fa0ea7bb319a7019b8c78a277278a375c24cff1811ec3d10fbb3b3e240"));
//#endregion
export { importMaterials };
