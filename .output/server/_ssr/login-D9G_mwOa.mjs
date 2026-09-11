import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getInitialData } from "./data.functions-DdHw2GTu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D9G_mwOa.js
var $$splitComponentImporter = () => import("./login-B2sKsi8Z.mjs");
var Route = createFileRoute("/_auth/login")({
	beforeLoad: ({ context }) => {},
	loader: async () => getInitialData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
