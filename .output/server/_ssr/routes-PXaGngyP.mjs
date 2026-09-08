import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getHistory, r as getInitialData } from "./data.functions-BFUQTEdz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-PXaGngyP.js
var $$splitComponentImporter = () => import("./routes-BF0IF2YS.mjs");
var Route = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async () => {
		const [data, history] = await Promise.all([getInitialData(), getHistory()]);
		return {
			data,
			history
		};
	}
});
//#endregion
export { Route as t };
