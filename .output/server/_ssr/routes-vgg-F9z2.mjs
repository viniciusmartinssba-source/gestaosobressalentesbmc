import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getInitialData, r as getHistory } from "./data.functions-DdHw2GTu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-vgg-F9z2.js
var $$splitComponentImporter = () => import("./routes-rIRrNi7G.mjs");
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
