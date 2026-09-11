import { createRequire } from "node:module";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DkEF2aAy.js
var manifest = {
	"1b9b7a2e863e1df16d7f1cf8c87021209fb01a21c0e1dfabc96d32ae4111d407": {
		functionName: "getInitialData_createServerFn_handler",
		importer: () => import("./_ssr/data.functions-lX2AKClI.mjs")
	},
	"1c64b5260d4652aaa90293b5428727a77c5bf10b8b533dd6fe4f443e9ee6dfdc": {
		functionName: "generateInsights_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DlpVJH7T.mjs")
	},
	"3449d09ae6e3dcce870286f7af9d51b83017256c19e7a03ce9e166087ecf9e49": {
		functionName: "deleteMovimentacao_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DlpVJH7T.mjs")
	},
	"4bf7302696455a8a83c5e45226bb8b13abb77b4171c8c5793a090aee59254c50": {
		functionName: "updateMovimentacao_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DlpVJH7T.mjs")
	},
	"88339309d2b23343f28f1a0637cdfd5dd541475747f99b1c0834dd25f1a449a0": {
		functionName: "addMaterial_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DlpVJH7T.mjs")
	},
	"b40ab88bc600f5455d5a482309a825f068a7484688f403397cdb05c38b6e1fbc": {
		functionName: "getHistory_createServerFn_handler",
		importer: () => import("./_ssr/data.functions-lX2AKClI.mjs")
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
export { __require as a, __exportAll as i, __commonJSMin as n, __toCommonJS as o, __esmMin as r, __toESM as s, getServerFnById as t };
