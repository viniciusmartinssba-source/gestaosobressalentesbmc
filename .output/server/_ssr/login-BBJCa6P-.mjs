import { a as __toESM } from "../_runtime.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useAuth } from "./data.functions-BFUQTEdz.mjs";
import { t as Route } from "./login-DJGWppL4.mjs";
import { a as CardHeader, i as CardDescription, n as Card, o as CardTitle, r as CardContent, s as Input, t as Button } from "./input-B3c4P4MK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Lock, n as Wind, r as User } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BBJCa6P-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const [matricula, setMatricula] = (0, import_react.useState)("");
	const [senha, setSenha] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const data = Route.useLoaderData();
	const { login } = useAuth();
	const navigate = useNavigate();
	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 800));
			const tecnico = data.tecnicos.find((t) => t.matricula.toLowerCase() === matricula.toLowerCase());
			if (tecnico) {
				const { error } = await login(tecnico.email, senha);
				if (error) toast.error("Credenciais inválidas. Verifique sua matrícula e senha.");
				else {
					toast.success(`Bem-vindo, ${tecnico.nome}!`);
					navigate({ to: "/" });
				}
			} else toast.error("Matrícula não encontrada.");
		} catch (error) {
			toast.error("Erro ao realizar login.");
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/40 rounded-full blur-[120px]" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md border-border bg-card/50 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative z-10 animate-in zoom-in duration-500",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "space-y-4 pt-10 pb-6 text-center border-b border-border/50 bg-accent/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto bg-primary w-16 h-16 flex items-center justify-center rounded-2xl text-primary-foreground shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-0 duration-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { size: 32 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-3xl font-extrabold tracking-tight",
						children: "Gestão de Sobressalentes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-muted-foreground mt-2 font-medium",
						children: "Acesse o painel operacional para registro de peças"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 text-[11px] text-primary/70 font-semibold uppercase tracking-widest flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }), "Portal do Técnico"]
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "pt-8 space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleLogin,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground/80 px-1",
								children: "Matrícula"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
									className: "absolute left-3.5 top-3 text-muted-foreground group-focus-within:text-primary transition-colors",
									size: 18
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "matricula",
									type: "text",
									placeholder: "Ex: U57097",
									value: matricula,
									onChange: (e) => setMatricula(e.target.value.toUpperCase()),
									required: true,
									className: "pl-11 h-12 rounded-xl bg-background border-border focus:ring-primary/20 transition-all text-base"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground/80 px-1",
								children: "Senha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
									className: "absolute left-3.5 top-3 text-muted-foreground group-focus-within:text-primary transition-colors",
									size: 18
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "senha",
									type: "password",
									placeholder: "Sua senha de acesso",
									value: senha,
									onChange: (e) => setSenha(e.target.value),
									required: true,
									className: "pl-11 h-12 rounded-xl bg-background border-border focus:ring-primary/20 transition-all text-base"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full h-13 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer bg-primary text-primary-foreground",
							disabled: isLoading,
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 h-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Autenticando..." })]
							}) : "Entrar no Painel"
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { LoginPage as component };
