import { a as __toESM } from "../_runtime.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as supabase } from "./client-Cf7aHSwH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useAuth } from "./data.functions-BFUQTEdz.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as CardHeader, c as cn, i as CardDescription, n as Card, o as CardTitle, r as CardContent, s as Input, t as Button } from "./input-B3c4P4MK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as ChevronDown, a as TrendingUp, b as Camera, c as Package, f as LayoutDashboard, g as ChevronUp, h as CircleCheck, i as TriangleAlert, l as Menu, m as CirclePlus, o as Search, p as FileDown, s as RotateCcwClock, t as X, u as LogOut, v as Check, x as Calendar, y as ChartColumn } from "../_libs/lucide-react.mjs";
import { t as Route } from "./routes-PXaGngyP.mjs";
import { a as Bar, c as Cell, d as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Pie, t as PieChart, u as Legend } from "../_libs/recharts+[...].mjs";
import { t as jo } from "../_libs/react-qr-reader.mjs";
import { t as E } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
import { t as require_xlsx_min } from "../_libs/xlsx-js-style.mjs";
import { t as format } from "../_libs/date-fns.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BF0IF2YS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_xlsx_min = /* @__PURE__ */ __toESM(require_xlsx_min());
var BarcodeScanner = ({ onScan, onClose }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] bg-black/90 md:bg-black/80 flex flex-col items-center justify-center p-0 md:p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full h-full md:h-auto md:max-w-md bg-white md:rounded-3xl overflow-hidden shadow-2xl flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 border-b flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-slate-800 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
						size: 20,
						className: "text-sky-600"
					}), " Scanner de Peça"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-2 hover:bg-slate-100 rounded-full transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 24 })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 p-4 flex flex-col justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-square md:aspect-auto md:h-64 overflow-hidden rounded-2xl bg-slate-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(jo, {
						onResult: (result, error) => {
							if (result) onScan(result.getText());
						},
						constraints: { facingMode: "environment" },
						containerStyle: { width: "100%" },
						videoStyle: {
							width: "100%",
							height: "100%",
							objectFit: "cover"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 border-2 border-sky-500/50 rounded-2xl pointer-events-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-center text-sm text-slate-500",
					children: "Posicione o código de barras ou QR Code da peça dentro da área marcada."
				})]
			})]
		})
	});
};
var exportToPDF = (data) => {
	const doc = new E();
	const primaryColor = [
		3,
		105,
		161
	];
	doc.setFontSize(18);
	doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
	doc.text("Relatório de Movimentação de Peças", 14, 22);
	doc.setFontSize(11);
	doc.setTextColor(100);
	doc.text(`Gerado em: ${format(/* @__PURE__ */ new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);
	autoTable(doc, {
		startY: 40,
		head: [[
			"Data",
			"Técnico",
			"Local",
			"SAP",
			"Peça",
			"Qtd",
			"WO"
		]],
		body: data.map((item) => [
			item.data,
			item.tecnico,
			`${item.parque} - ${item.aero}`,
			item.sap,
			item.peca,
			item.quantidade.toString(),
			item.wo || "-"
		]),
		headStyles: {
			fillColor: primaryColor,
			textColor: [
				255,
				255,
				255
			],
			fontSize: 10,
			fontStyle: "bold"
		},
		alternateRowStyles: { fillColor: [
			248,
			250,
			252
		] },
		margin: { top: 40 }
	});
	doc.save(`relatorio-movimentacao-${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.pdf`);
};
var exportToXLSX = (data) => {
	const dark = "FF0F172A";
	const primary = "FF0369A1";
	const primaryLight = "FF0EA5E9";
	const rowAlt = "FFF0F9FF";
	const rowBase = "FFFFFFFF";
	const borderColor = "FF94A3B8";
	const headers = [
		"Data",
		"Técnico",
		"Parque",
		"Aerogerador",
		"Código SAP",
		"Descrição da Peça",
		"Quantidade",
		"Work Order",
		"Estoque"
	];
	const border = {
		top: {
			style: "thin",
			color: { rgb: borderColor }
		},
		bottom: {
			style: "thin",
			color: { rgb: borderColor }
		},
		left: {
			style: "thin",
			color: { rgb: borderColor }
		},
		right: {
			style: "thin",
			color: { rgb: borderColor }
		}
	};
	const titleCell = {
		font: {
			bold: true,
			sz: 16,
			color: { rgb: primaryLight },
			name: "Calibri"
		},
		fill: {
			patternType: "solid",
			fgColor: { rgb: dark }
		},
		alignment: {
			horizontal: "center",
			vertical: "center"
		}
	};
	const subtitleCell = {
		font: {
			sz: 10,
			color: { rgb: "FFCBD5E1" },
			name: "Calibri"
		},
		fill: {
			patternType: "solid",
			fgColor: { rgb: dark }
		},
		alignment: {
			horizontal: "center",
			vertical: "center"
		}
	};
	const headerCell = {
		font: {
			bold: true,
			sz: 11,
			color: { rgb: "FFFFFFFF" },
			name: "Calibri"
		},
		fill: {
			patternType: "solid",
			fgColor: { rgb: primary }
		},
		alignment: {
			horizontal: "center",
			vertical: "center",
			wrapText: true
		},
		border
	};
	const bodyCell = (alt, numeric = false) => ({
		font: {
			sz: 11,
			color: { rgb: dark },
			name: "Calibri"
		},
		fill: {
			patternType: "solid",
			fgColor: { rgb: alt ? rowAlt : rowBase }
		},
		alignment: {
			horizontal: numeric ? "center" : "left",
			vertical: "center"
		},
		border
	});
	const aoa = [
		[`GESTÃO DE SOBRESSALENTES — RELATÓRIO DE MOVIMENTAÇÃO`],
		[`Gerado em ${format(/* @__PURE__ */ new Date(), "dd/MM/yyyy 'às' HH:mm")}  •  ${data.length} registros`],
		headers,
		...data.map((item) => [
			item.data,
			item.tecnico,
			item.parque,
			item.aero,
			item.sap,
			item.peca,
			item.quantidade,
			item.wo || "-",
			item.estoque || "-"
		])
	];
	const ws = import_xlsx_min.utils.aoa_to_sheet(aoa);
	const totalCols = headers.length;
	for (let c = 0; c < totalCols; c++) {
		ws[import_xlsx_min.utils.encode_cell({
			r: 0,
			c
		})] = {
			...titleCell,
			v: c === 0 ? aoa[0][0] : "",
			t: "s"
		};
		ws[import_xlsx_min.utils.encode_cell({
			r: 1,
			c
		})] = {
			...subtitleCell,
			v: c === 0 ? aoa[1][0] : "",
			t: "s"
		};
	}
	for (let c = 0; c < totalCols; c++) {
		const ref = import_xlsx_min.utils.encode_cell({
			r: 2,
			c
		});
		ws[ref] = {
			v: headers[c],
			t: "s",
			...headerCell
		};
	}
	data.forEach((item, i) => {
		const r = i + 3;
		const alt = i % 2 === 1;
		const row = aoa[r];
		for (let c = 0; c < totalCols; c++) {
			const ref = import_xlsx_min.utils.encode_cell({
				r,
				c
			});
			const numeric = c === 3 || c === 6;
			const isNum = c === 6;
			ws[ref] = {
				v: row[c],
				t: isNum ? "n" : "s",
				...bodyCell(alt, numeric)
			};
		}
	});
	ws["!merges"] = [{
		s: {
			r: 0,
			c: 0
		},
		e: {
			r: 0,
			c: totalCols - 1
		}
	}, {
		s: {
			r: 1,
			c: 0
		},
		e: {
			r: 1,
			c: totalCols - 1
		}
	}];
	ws["!cols"] = [
		{ wch: 18 },
		{ wch: 24 },
		{ wch: 18 },
		{ wch: 12 },
		{ wch: 14 },
		{ wch: 42 },
		{ wch: 12 },
		{ wch: 14 },
		{ wch: 14 }
	];
	ws["!rows"] = [
		{ hpt: 30 },
		{ hpt: 18 },
		{ hpt: 24 }
	];
	const wb = import_xlsx_min.utils.book_new();
	import_xlsx_min.utils.book_append_sheet(wb, ws, "Movimentações");
	import_xlsx_min.writeFile(wb, `relatorio-movimentacao-${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.xlsx`);
};
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var COLORS = [
	"#0ea5e9",
	"#6366f1",
	"#8b5cf6",
	"#ec4899"
];
function Dashboard() {
	const { data, history: initialHistory } = Route.useLoaderData();
	const { user, logout, isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [isSidebarOpen, setIsSidebarOpen] = (0, import_react.useState)(false);
	const [isScannerOpen, setIsScannerOpen] = (0, import_react.useState)(false);
	const [sapInput, setSapInput] = (0, import_react.useState)("");
	const [foundPeca, setFoundPeca] = (0, import_react.useState)(null);
	const [catalogSearch, setCatalogSearch] = (0, import_react.useState)("");
	const [pecaSearch, setPecaSearch] = (0, import_react.useState)("");
	const [isImportModalOpen, setIsImportModalOpen] = (0, import_react.useState)(false);
	const [importText, setImportText] = (0, import_react.useState)("");
	const [selectedParqueId, setSelectedParqueId] = (0, import_react.useState)(data.parques[0]?.id || "");
	const [selectedAero, setSelectedAero] = (0, import_react.useState)(data.parques[0]?.aeros[0]?.toString() || "");
	const [selectedEstoque, setSelectedEstoque] = (0, import_react.useState)(data.estoques[0] || "");
	const [quantidade, setQuantidade] = (0, import_react.useState)(1);
	const [wo, setWo] = (0, import_react.useState)("");
	const [foto, setFoto] = (0, import_react.useState)(null);
	const [fotoPreview, setFotoPreview] = (0, import_react.useState)(null);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [history, setHistory] = (0, import_react.useState)(initialHistory);
	(0, import_react.useEffect)(() => {
		if (!isAuthLoading && !isAuthenticated) navigate({ to: "/login" });
	}, [
		isAuthenticated,
		isAuthLoading,
		navigate
	]);
	const selectedParque = (0, import_react.useMemo)(() => data.parques.find((p) => p.id === selectedParqueId) || data.parques[0], [data.parques, selectedParqueId]);
	(0, import_react.useEffect)(() => {
		if (!sapInput) {
			setFoundPeca(null);
			return;
		}
		const peca = data.catalogo.find((p) => p.sap === sapInput);
		setFoundPeca(peca || null);
	}, [sapInput, data.catalogo]);
	const handleFotoChange = (file) => {
		if (!file) {
			setFoto(null);
			setFotoPreview(null);
			return;
		}
		if (!file.type.startsWith("image/")) {
			toast.error("Selecione um arquivo de imagem.");
			return;
		}
		if (file.size > 10485760) {
			toast.error("A imagem deve ter no máximo 10MB.");
			return;
		}
		setFoto(file);
		setFotoPreview(URL.createObjectURL(file));
	};
	const handleRegister = async () => {
		if (!selectedParqueId || !selectedAero || !foundPeca || !user) {
			toast.error("Preencha Parque Eólico, Aerogerador e Código SAP.");
			return;
		}
		setIsSubmitting(true);
		try {
			let fotoPath = null;
			if (foto) {
				const ext = foto.name.split(".").pop() || "jpg";
				const path = `${user.id}/${Date.now()}.${ext}`;
				const { error: uploadError } = await supabase.storage.from("movimentacoes-fotos").upload(path, foto, { contentType: foto.type });
				if (uploadError) {
					console.error("Error uploading photo:", uploadError);
					toast.error("Não foi possível enviar a foto. Registro seguirá sem imagem.");
				} else fotoPath = path;
			}
			const { data: mData, error } = await supabase.from("movimentacoes").insert({
				tecnico_id: user.id,
				parque_id: selectedParqueId,
				aero: selectedAero.padStart(2, "0"),
				sap: foundPeca.sap,
				quantidade,
				wo,
				estoque: selectedEstoque,
				foto_url: fotoPath
			}).select(`
          *,
          profiles (nome),
          parques (nome),
          pecas (sap, descricao)
        `).single();
			if (error) throw error;
			const newEntry = {
				id: mData.id,
				data: new Date(mData.data).toLocaleString("pt-BR"),
				tecnico: mData.profiles?.nome || user.nome,
				parque: mData.parques?.nome || selectedParque?.nome || "",
				aero: mData.aero,
				sap: mData.sap,
				peca: mData.pecas?.descricao || foundPeca.descricao,
				quantidade: mData.quantidade,
				wo: mData.wo || "",
				estoque: mData.estoque || ""
			};
			setHistory([newEntry, ...history]);
			toast.success("Movimentação registrada com sucesso!");
			confetti_module_default({
				particleCount: 100,
				spread: 70,
				origin: { y: .6 },
				colors: ["#0ea5e9", "#6366f1"]
			});
			setSapInput("");
			setQuantidade(1);
			setWo("");
			setFoto(null);
			setFotoPreview(null);
			setActiveTab("history");
		} catch (error) {
			console.error("Error registering movement:", error);
			toast.error("Erro ao registrar movimentação.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleLogout = () => {
		logout();
		toast.info("Você saiu do sistema.");
	};
	const stats = (0, import_react.useMemo)(() => {
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const countToday = history.filter((h) => {
			const parts = h.data.split(", ")[0]?.split("/");
			if (!parts || parts.length < 3) return false;
			return (/* @__PURE__ */ new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)).getTime() >= today.getTime();
		}).length;
		const countMonth = history.filter((h) => {
			const parts = h.data.split(", ")[0]?.split("/");
			if (!parts || parts.length < 3) return false;
			return (/* @__PURE__ */ new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)).getTime() >= startOfMonth.getTime();
		}).length;
		return [
			{
				title: "Total Geral de Saídas",
				value: history.length.toString(),
				icon: Package,
				change: "+12%"
			},
			{
				title: "Retiradas Hoje",
				value: countToday.toString(),
				icon: Calendar,
				change: "Atualizado"
			},
			{
				title: "Retiradas no Mês",
				value: countMonth.toString(),
				icon: TrendingUp,
				change: "+5%"
			},
			{
				title: "Peças Críticas (IA)",
				value: "14",
				icon: TriangleAlert,
				change: "-2",
				color: "text-red-500"
			}
		];
	}, [history]);
	const chartData = (0, import_react.useMemo)(() => data.parques.map((p) => ({
		name: p.nome,
		value: history.filter((h) => h.parque === p.nome).length
	})), [data.parques, history]);
	const aeroChartData = (0, import_react.useMemo)(() => {
		const aeroCounts = {};
		history.forEach((h) => {
			const key = `Aero ${h.aero}`;
			aeroCounts[key] = (aeroCounts[key] || 0) + 1;
		});
		return Object.entries(aeroCounts).map(([name, value]) => ({
			name,
			value
		})).sort((a, b) => b.value - a.value).slice(0, 5);
	}, [history]);
	const pieData = (0, import_react.useMemo)(() => [
		{
			name: "Em Uso",
			value: 400
		},
		{
			name: "Crítico",
			value: 300
		},
		{
			name: "Reserva",
			value: 200
		},
		{
			name: "Manutenção",
			value: 100
		}
	], []);
	const handleScan = (sap) => {
		setSapInput(sap);
		setIsScannerOpen(false);
	};
	if (!isAuthenticated || !user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-background font-sans text-foreground overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 flex items-center gap-3 border-b border-sidebar-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg shadow-primary/20 animate-in zoom-in duration-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-bold text-lg leading-tight tracking-tight text-sidebar-foreground",
							children: [
								"Gestão de",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Sobressalentes"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex-1 p-4 space-y-2 overflow-y-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("overview"),
								className: cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer", activeTab === "overview" ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, {
									size: 20,
									className: cn("transition-transform group-hover:scale-110", activeTab === "overview" && "scale-110")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Dashboard"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("register"),
								className: cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer", activeTab === "register" ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, {
									size: 20,
									className: cn("transition-transform group-hover:scale-110", activeTab === "register" && "scale-110")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Registrar Saída"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("history"),
								className: cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer", activeTab === "history" ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcwClock, {
									size: 20,
									className: cn("transition-transform group-hover:scale-110", activeTab === "history" && "scale-110")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Histórico"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("catalog"),
								className: cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer", activeTab === "catalog" ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									size: 20,
									className: cn("transition-transform group-hover:scale-110", activeTab === "catalog" && "scale-110")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Catálogo"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-t border-sidebar-border/50 bg-sidebar-accent/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl border border-transparent hover:border-sidebar-border transition-colors group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0 transition-transform group-hover:scale-105",
								children: user.nome.split(" ").map((n) => n[0]).join("")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold truncate text-sidebar-foreground",
									children: user.nome
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-sidebar-foreground/50 font-medium uppercase tracking-wider",
									children: user.matricula
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleLogout,
							className: "flex items-center gap-3 w-full px-4 py-2.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 text-sm font-medium group cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
								size: 18,
								className: "transition-transform group-hover:-translate-x-1"
							}), "Sair do Sistema"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 flex flex-col overflow-hidden relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "bg-card border-b border-border h-16 flex items-center justify-between px-4 md:px-6 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open: isSidebarOpen,
							onOpenChange: setIsSidebarOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "md:hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 24 })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "left",
								className: "p-0 w-72",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
									className: "p-6 flex-row items-center gap-3 border-b border-slate-100 text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-primary p-2 rounded-lg text-primary-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
										className: "font-bold text-lg leading-tight",
										children: [
											"Gestão de",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"Sobressalentes"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col h-[calc(100vh-85px)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
										className: "flex-1 p-4 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setActiveTab("overview");
													setIsSidebarOpen(false);
												},
												className: cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all", activeTab === "overview" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 20 }), " Dashboard"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setActiveTab("register");
													setIsSidebarOpen(false);
												},
												className: cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all", activeTab === "register" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { size: 20 }), " Registrar Saída"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setActiveTab("history");
													setIsSidebarOpen(false);
												},
												className: cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all", activeTab === "history" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcwClock, { size: 20 }), " Histórico"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setActiveTab("catalog");
													setIsSidebarOpen(false);
												},
												className: cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all", activeTab === "catalog" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 20 }), " Catálogo"]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 px-4 py-3 mb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground shrink-0",
												children: user.nome.split(" ").map((n) => n[0]).join("")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 overflow-hidden",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium truncate",
													children: user.nome
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: user.matricula
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: handleLogout,
											className: "flex items-center gap-3 w-full px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 18 }), " Sair"]
										})]
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm md:text-lg font-semibold uppercase tracking-wider text-muted-foreground truncate max-w-[200px] md:max-w-none",
							children: [
								activeTab === "overview" && "Dashboard",
								activeTab === "register" && "Registro",
								activeTab === "history" && "Histórico",
								activeTab === "catalog" && "Catálogo"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-medium text-slate-500 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
								size: 16,
								className: "hidden sm:block"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:block",
								children: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
									day: "numeric",
									month: "long",
									year: "numeric"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
									day: "numeric",
									month: "2-digit"
								})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 md:p-8",
					children: [
						activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-primary/10 p-4 rounded-2xl text-primary shadow-inner shrink-0 transition-transform group-hover:scale-110 duration-500",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { size: 32 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex-1 text-center md:text-left z-10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-xl font-bold text-foreground",
												children: "Insights Estratégicos"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											className: "w-full md:w-auto rounded-xl px-6 font-semibold shadow-sm hover:scale-105 transition-transform cursor-pointer",
											children: "Análise Completa"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
									children: stats.map((stat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "rounded-3xl border-border bg-card/50 backdrop-blur-sm shadow-none hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between items-start",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium text-muted-foreground mb-1",
													children: stat.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: cn("text-3xl font-extrabold tracking-tight transition-colors", stat.color || "text-foreground"),
													children: stat.value
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-accent/50 p-3 rounded-2xl text-primary transition-transform group-hover:rotate-12",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(stat.icon, { size: 24 })
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 w-fit px-3 py-1 rounded-full",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 12 }),
													stat.change,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-emerald-700/70 font-medium",
														children: "vs mês anterior"
													})
												]
											})]
										})
									}, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
											className: "rounded-3xl border-border shadow-none p-6 bg-card/50 backdrop-blur-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
												className: "p-0 pb-6",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-lg font-bold",
													children: "Distribuição por Parque"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Volume de retiradas por unidade eólica" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
												className: "h-[300px] p-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
													width: "100%",
													height: "100%",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
														data: chartData,
														margin: {
															top: 20,
															right: 20,
															left: 0,
															bottom: 0
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
																strokeDasharray: "3 3",
																vertical: false,
																stroke: "var(--border)",
																opacity: .4
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
																dataKey: "name",
																axisLine: false,
																tickLine: false,
																tick: {
																	fill: "var(--muted-foreground)",
																	fontSize: 12
																},
																dy: 10
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
																axisLine: false,
																tickLine: false,
																tick: {
																	fill: "var(--muted-foreground)",
																	fontSize: 12
																}
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
																cursor: {
																	fill: "var(--accent)",
																	opacity: .2
																},
																contentStyle: {
																	backgroundColor: "var(--card)",
																	borderColor: "var(--border)",
																	borderRadius: "12px",
																	boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
																}
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
																dataKey: "value",
																fill: "var(--primary)",
																radius: [
																	6,
																	6,
																	0,
																	0
																],
																barSize: 40
															})
														]
													})
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
											className: "rounded-3xl border-border shadow-none p-6 bg-card/50 backdrop-blur-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
												className: "p-0 pb-6",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-lg font-bold",
													children: "Uso por Aerogerador"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Top 5 aerogeradores com mais movimentações" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
												className: "h-[300px] p-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
													width: "100%",
													height: "100%",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
														data: aeroChartData,
														layout: "vertical",
														margin: {
															top: 5,
															right: 30,
															left: 20,
															bottom: 5
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
																strokeDasharray: "3 3",
																horizontal: false,
																stroke: "var(--border)",
																opacity: .4
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
																type: "number",
																hide: true
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
																dataKey: "name",
																type: "category",
																axisLine: false,
																tickLine: false,
																tick: {
																	fill: "var(--muted-foreground)",
																	fontSize: 12
																}
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
																cursor: {
																	fill: "var(--accent)",
																	opacity: .2
																},
																contentStyle: {
																	backgroundColor: "var(--card)",
																	borderColor: "var(--border)",
																	borderRadius: "12px",
																	boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
																}
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
																dataKey: "value",
																fill: "var(--chart-2)",
																radius: [
																	0,
																	6,
																	6,
																	0
																],
																barSize: 24
															})
														]
													})
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
											className: "rounded-3xl border-border shadow-none p-6 bg-card/50 backdrop-blur-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
												className: "p-0 pb-6",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-lg font-bold",
													children: "Status do Inventário"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Visão geral de peças em campo" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
												className: "h-[300px] p-0 flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
													width: "100%",
													height: "100%",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
															data: pieData,
															cx: "50%",
															cy: "40%",
															innerRadius: 60,
															outerRadius: 90,
															paddingAngle: 5,
															dataKey: "value",
															stroke: "none",
															children: pieData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index % COLORS.length] || "#0ea5e9" }, `cell-${index}`))
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
															backgroundColor: "var(--card)",
															borderColor: "var(--border)",
															borderRadius: "12px",
															boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
														} }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
															verticalAlign: "bottom",
															height: 36
														})
													] })
												})
											})]
										})
									]
								})
							]
						}),
						activeTab === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in zoom-in-95 duration-200 px-0 sm:px-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-none shadow-md shadow-border overflow-hidden rounded-none sm:rounded-2xl bg-card text-card-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "bg-primary text-primary-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Nova Movimentação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-primary-foreground/80",
										children: "Preencha os campos abaixo para registrar a retirada da peça."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "space-y-6 pt-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Parque Eólico ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: selectedParqueId,
													onValueChange: (val) => {
														setSelectedParqueId(val);
														const p = data.parques.find((p) => p.id === val);
														if (p) setSelectedAero(p.aeros[0].toString());
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-12 rounded-xl bg-slate-50 text-black",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o parque" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: data.parques.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: p.id,
														children: p.nome
													}, p.id)) })]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Aerogerador ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: selectedAero,
													onValueChange: setSelectedAero,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-12 rounded-xl bg-slate-50 text-black",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o aero" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: selectedParque?.aeros.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: a.toString(),
														children: ["Aero ", a.toString().padStart(2, "0")]
													}, a)) })]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Código SAP da Peça ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "text",
															inputMode: "numeric",
															value: sapInput,
															onChange: (e) => setSapInput(e.target.value.trim()),
															placeholder: "Digite o código SAP",
															className: cn("h-12 rounded-xl bg-slate-50 pr-10 text-black font-mono", foundPeca && "border-emerald-500 ring-emerald-500", sapInput && !foundPeca && "border-destructive")
														}), foundPeca ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
															className: "absolute right-3 top-3 text-emerald-500",
															size: 20
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {
															className: "absolute right-3 top-3 text-slate-400",
															size: 20
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "secondary",
														size: "icon",
														onClick: () => setIsScannerOpen(true),
														className: "h-12 w-12 rounded-xl shrink-0",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
															size: 24,
															className: "text-slate-600"
														})
													})]
												}),
												foundPeca ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-1",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-emerald-700 font-medium",
														children: foundPeca.descricao
													})
												}) : sapInput ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-destructive font-medium",
													children: "Código SAP não encontrado no catálogo."
												}) : null
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Consultar Peça (por código ou nome)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "text",
														value: pecaSearch,
														onChange: (e) => setPecaSearch(e.target.value),
														placeholder: "Ex.: 28477 ou BASE RELE",
														className: "h-12 rounded-xl bg-slate-50 pr-10 text-black"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
														className: "absolute right-3 top-3 text-slate-400",
														size: 20
													}),
													pecaSearch.trim().length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg max-h-56 overflow-y-auto overflow-x-hidden",
														children: [data.catalogo.filter((p) => p.sap.toLowerCase().includes(pecaSearch.trim().toLowerCase()) || p.descricao.toLowerCase().includes(pecaSearch.trim().toLowerCase())).slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															className: "w-full text-left p-3 hover:bg-accent/50 transition-colors border-b border-border/50 last:border-0",
															onClick: () => {
																setSapInput(p.sap);
																setFoundPeca(p);
																setPecaSearch("");
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "font-mono text-xs font-bold text-primary",
																children: p.sap
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-sm truncate",
																children: p.descricao
															})]
														}, p.sap)), data.catalogo.filter((p) => p.sap.toLowerCase().includes(pecaSearch.trim().toLowerCase()) || p.descricao.toLowerCase().includes(pecaSearch.trim().toLowerCase())).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "p-3 text-sm text-muted-foreground",
															children: "Nenhuma peça encontrada."
														})]
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: quantidade,
													onChange: (e) => setQuantidade(Number(e.target.value)),
													className: "h-12 rounded-xl bg-background",
													min: 1
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estoque (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: selectedEstoque,
													onValueChange: setSelectedEstoque,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-12 rounded-xl bg-background",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: data.estoques.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: e,
														children: ["Estoque ", e]
													}, e)) })]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Work Order (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "text",
												value: wo,
												onChange: (e) => setWo(e.target.value),
												placeholder: "Número da WO",
												className: "h-12 rounded-xl bg-background"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Foto da Peça (Opcional)" }),
												fotoPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative rounded-xl overflow-hidden border border-border",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: fotoPreview,
														alt: "Pré-visualização da foto da peça",
														className: "w-full max-h-56 object-cover"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "secondary",
														size: "icon",
														onClick: () => handleFotoChange(null),
														className: "absolute top-2 right-2 h-9 w-9 rounded-lg",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "foto-peca",
													className: "flex flex-col items-center justify-center gap-2 h-28 rounded-xl border border-dashed border-border bg-background cursor-pointer hover:bg-accent/40 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
														size: 22,
														className: "text-muted-foreground"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm text-muted-foreground",
														children: "Toque para tirar ou anexar uma foto"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: "foto-peca",
													type: "file",
													accept: "image/*",
													capture: "environment",
													className: "hidden",
													onChange: (e) => handleFotoChange(e.target.files?.[0] ?? null)
												}),
												foto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground truncate",
													children: foto.name
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: handleRegister,
											disabled: !selectedParqueId || !selectedAero || !foundPeca || isSubmitting,
											className: "w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all bg-primary text-primary-foreground hover:bg-primary/90",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { size: 20 }),
												" ",
												isSubmitting ? "Registrando..." : "Confirmar Retirada"
											]
										})
									]
								})]
							})
						}),
						activeTab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 animate-in fade-in duration-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-bold text-foreground",
									children: "Registros Recentes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 w-full sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => exportToXLSX(history),
										className: "flex-1 sm:flex-none rounded-xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { size: 18 }), " Excel"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => exportToPDF(history),
										className: "flex-1 sm:flex-none rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { size: 18 }), " PDF"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "border-none shadow-sm shadow-border bg-card text-card-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "bg-muted/30 hover:bg-muted/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "font-bold whitespace-nowrap",
												children: "Data"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "font-bold whitespace-nowrap",
												children: "Técnico"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "font-bold whitespace-nowrap",
												children: "Local"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "font-bold whitespace-nowrap",
												children: "Peça"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "font-bold whitespace-nowrap",
												children: "Qtd"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "font-bold text-right whitespace-nowrap",
												children: "WO"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: history.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-muted-foreground text-xs",
												children: item.data
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "font-medium",
												children: item.tecnico
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
												className: "text-muted-foreground",
												children: [
													item.parque,
													" - ",
													item.aero
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: item.peca
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: ["SAP ", item.sap]
												})]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "rounded-lg",
												children: item.quantidade
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-right",
												children: item.wo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: "bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-lg",
													children: item.wo
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted/30 text-xs",
													children: "-"
												})
											})
										]
									}, i)) })] })
								})
							})]
						}),
						activeTab === "catalog" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 animate-in fade-in duration-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 w-full sm:max-w-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
											className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
											size: 18
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Buscar por SAP ou Nome da Peça...",
											className: "pl-10 h-11 rounded-xl bg-card border-border",
											value: catalogSearch,
											onChange: (e) => setCatalogSearch(e.target.value)
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2 w-full sm:w-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "flex-1 sm:flex-none rounded-xl",
										onClick: () => setIsImportModalOpen(true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { size: 18 }), " Importar Planilha"]
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "border-none shadow-sm shadow-border bg-card text-card-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "bg-muted/30 hover:bg-muted/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "font-bold w-32",
											children: "Código SAP"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "font-bold",
											children: "Descrição do Material"
										})]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [data.catalogo.filter((p) => p.sap.toLowerCase().includes(catalogSearch.toLowerCase()) || p.descricao.toLowerCase().includes(catalogSearch.toLowerCase())).map((peca, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-mono font-bold text-primary",
											children: peca.sap
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-medium",
											children: peca.descricao
										})]
									}, peca.sap)), data.catalogo.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										colSpan: 2,
										className: "h-32 text-center text-muted-foreground",
										children: "Nenhum material cadastrado."
									}) })] })] })
								})
							})]
						}),
						isImportModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "w-full max-w-2xl rounded-3xl overflow-hidden border-none shadow-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
									className: "bg-primary text-primary-foreground p-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
											className: "text-2xl",
											children: "Importar Materiais"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
											className: "text-primary-foreground/80 mt-1",
											children: [
												"O código SAP e o nome do material deve estar fiel a planilha, favor revisar e validar",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: "https://docs.google.com/spreadsheets/d/1swsdF6X6sEgR-nz0hxwmBZEV7vD-B9dG/edit?usp=sharing&ouid=107218104711689257347&rtpof=true&sd=true",
													target: "_blank",
													rel: "noopener noreferrer",
													className: "underline hover:text-white transition-colors",
													children: "https://docs.google.com/spreadsheets/d/1swsdF6X6sEgR-nz0hxwmBZEV7vD-B9dG/edit?usp=sharing&ouid=107218104711689257347&rtpof=true&sd=true"
												})
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => setIsImportModalOpen(false),
											className: "text-primary-foreground hover:bg-white/10 rounded-full",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 24 })
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-6 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-sm font-semibold",
												children: "Conteúdo da Planilha (Copiado/Colado)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												className: "w-full h-64 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none font-mono text-xs resize-none",
												placeholder: "Exemplo:\n1001;Placa Eletrônica\n1002;Fusível 10A...",
												value: importText,
												onChange: (e) => setImportText(e.target.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "O sistema aceita formatos separados por ponto e vírgula (;), vírgula (,) ou tabulação."
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "flex-1 rounded-xl h-12",
											onClick: () => setIsImportModalOpen(false),
											children: "Cancelar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "flex-[2] rounded-xl h-12 font-bold",
											onClick: async () => {
												try {
													const { importMaterials } = await import("./admin.functions-CpQKlWNv.mjs");
													const result = await importMaterials({ data: { csvData: importText } });
													toast.success(`${result.importedCount} materiais importados com sucesso!`);
													setIsImportModalOpen(false);
													setImportText("");
													window.location.reload();
												} catch (err) {
													toast.error(err.message || "Erro na importação.");
												}
											},
											disabled: !importText.trim(),
											children: "Processar e Salvar no Banco"
										})]
									})]
								})]
							})
						})
					]
				})]
			}),
			isScannerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScanner, {
				onScan: handleScan,
				onClose: () => setIsScannerOpen(false)
			})
		]
	});
}
//#endregion
export { Dashboard as component };
