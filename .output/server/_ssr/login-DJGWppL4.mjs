import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getInitialData } from "./data.functions-BFUQTEdz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DJGWppL4.js
var $$splitComponentImporter = () => import("./login-BBJCa6P-.mjs");
var Route = createFileRoute("/_auth/login")({
	beforeLoad: ({ context }) => {},
	loader: async () => getInitialData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
