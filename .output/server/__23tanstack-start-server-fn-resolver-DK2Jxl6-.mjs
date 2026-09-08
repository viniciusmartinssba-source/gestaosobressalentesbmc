//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DK2Jxl6-.js
var manifest = {
	"1b9b7a2e863e1df16d7f1cf8c87021209fb01a21c0e1dfabc96d32ae4111d407": {
		functionName: "getInitialData_createServerFn_handler",
		importer: () => import("./_ssr/data.functions-BehWaI_o.mjs")
	},
	"b40ab88bc600f5455d5a482309a825f068a7484688f403397cdb05c38b6e1fbc": {
		functionName: "getHistory_createServerFn_handler",
		importer: () => import("./_ssr/data.functions-BehWaI_o.mjs")
	},
	"c63d92fa0ea7bb319a7019b8c78a277278a375c24cff1811ec3d10fbb3b3e240": {
		functionName: "importMaterials_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-CjW2Nbjg.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
