import { a as __toESM } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DKvxGDvJ.mjs";
import { t as supabase } from "./client-Cf7aHSwH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data.functions-BFUQTEdz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [session, setSession] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			if (session) fetchProfile(session.user.id);
			else setIsLoading(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			if (session) fetchProfile(session.user.id);
			else {
				setUser(null);
				setIsLoading(false);
			}
		});
		return () => subscription.unsubscribe();
	}, []);
	const fetchProfile = async (userId) => {
		try {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
			if (error) throw error;
			setUser(data);
		} catch (error) {
			console.error("Error fetching profile:", error);
		} finally {
			setIsLoading(false);
		}
	};
	const login = async (email, matricula) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password: matricula
		});
		return { error };
	};
	const logout = async () => {
		await supabase.auth.signOut();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			session,
			login,
			logout,
			isAuthenticated: !!session,
			isLoading
		},
		children
	});
}
var useAuth = () => {
	const context = (0, import_react.useContext)(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};
var getInitialData = createServerFn({ method: "GET" }).handler(createSsrRpc("1b9b7a2e863e1df16d7f1cf8c87021209fb01a21c0e1dfabc96d32ae4111d407"));
var getHistory = createServerFn({ method: "GET" }).handler(createSsrRpc("b40ab88bc600f5455d5a482309a825f068a7484688f403397cdb05c38b6e1fbc"));
//#endregion
export { useAuth as i, getHistory as n, getInitialData as r, AuthProvider as t };
