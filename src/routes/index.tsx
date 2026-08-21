import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  History as HistoryIcon, 
  LogOut, 
  Search, 
  PlusCircle, 
  TrendingUp, 
  AlertTriangle,
  Menu,
  X,
  Wind,
  Camera,
  FileDown,
  CheckCircle2,
  BarChart3,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { getInitialData } from "@/lib/data.functions";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { exportToPDF, exportToXLSX } from "@/lib/reports";
import confetti from "canvas-confetti";
import { format } from "date-fns";

export const Route = createFileRoute("/")({
  component: Dashboard,
  loader: async () => getInitialData(),
});

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];

function Dashboard() {
  const data = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [sapInput, setSapInput] = useState("");
  const [foundPeca, setFoundPeca] = useState<{sap: string, descricao: string} | null>(null);
  
  // Form state
  const [selectedParque, setSelectedParque] = useState(data.parques[0]);
  const [selectedAero, setSelectedAero] = useState(data.parques[0].aeros[0]);
  const [selectedEstoque, setSelectedEstoque] = useState(data.estoques[0]);
  const [quantidade, setQuantidade] = useState(1);
  const [wo, setWo] = useState("");
  
  // History state (mock)
  const [history, setHistory] = useState([
    { data: "21/08/2026 09:45", tecnico: "Bruno Terras", parque: "Macaúbas", aero: "04", sap: "1001", peca: "Rolamento Principal", quantidade: 1, wo: "WO-8872", estoque: "1670" },
    { data: "20/08/2026 14:20", tecnico: "Leonardo Martins", parque: "Seabra", aero: "02", sap: "1005", peca: "Filtro de Óleo", quantidade: 2, wo: "WO-9912", estoque: "1673" },
  ]);

  useEffect(() => {
    const peca = data.catalogo.find(p => p.sap === sapInput);
    setFoundPeca(peca || null);
  }, [sapInput, data.catalogo]);

  const handleRegister = () => {
    if (!foundPeca) return;
    
    const newEntry = {
      data: format(new Date(), "dd/MM/yyyy HH:mm"),
      tecnico: "Bruno Terras", // Simulated user
      parque: selectedParque.nome,
      aero: selectedAero?.toString() || "0",
      sap: foundPeca.sap,
      peca: foundPeca.descricao,
      quantidade,
      wo,
      estoque: selectedEstoque
    };
    
    setHistory([newEntry, ...history]);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0ea5e9', '#6366f1']
    });
    
    // Reset form
    setSapInput("");
    setQuantidade(1);
    setWo("");
    setActiveTab("history");
  };

  const stats = [
    { title: "Total de Saídas", value: history.length.toString(), icon: Package, change: "+12%" },
    { title: "Peças Críticas", value: "14", icon: AlertTriangle, change: "-2", color: "text-red-500" },
    { title: "Uso de WO", value: "85%", icon: TrendingUp, change: "+5%" },
  ];

  const chartData = data.parques.map(p => ({
    name: p.nome,
    value: history.filter(h => h.parque === p.nome).length + Math.floor(Math.random() * 10) // Adding random for visual effect
  }));

  const pieData = [
    { name: 'Mecânico', value: 400 },
    { name: 'Elétrico', value: 300 },
    { name: 'Sensores', value: 200 },
    { name: 'Outros', value: 100 },
  ];

  const handleScan = (sap: string) => {
    setSapInput(sap);
    setIsScannerOpen(false);
  };
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 md:relative md:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="bg-sky-600 p-2 rounded-lg text-white">
              <Wind size={24} />
            </div>
            <h1 className="font-bold text-lg leading-tight">Gestão de<br/>Sobressalentes</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                activeTab === "overview" ? "bg-sky-50 text-sky-700 font-medium" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("register")}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                activeTab === "register" ? "bg-sky-50 text-sky-700 font-medium" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <PlusCircle size={20} /> Registrar Saída
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                activeTab === "history" ? "bg-sky-50 text-sky-700 font-medium" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <HistoryIcon size={20} /> Histórico
            </button>
            <button 
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50"
            >
              <Search size={20} /> Catálogo
            </button>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                BT
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Bruno Terras</p>
                <p className="text-xs text-slate-400">U57097</p>
              </div>
            </div>
            <button className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-500">
              {activeTab === "overview" && "Dashboard Operacional"}
              {activeTab === "register" && "Registro de Movimentação"}
              {activeTab === "history" && "Histórico de Lançamentos"}
            </h2>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm shadow-slate-200 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                          <h3 className={cn("text-2xl font-bold", stat.color || "text-slate-900")}>{stat.value}</h3>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl">
                          <stat.icon className="text-sky-600" size={24} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
                        {stat.change} <span className="text-slate-400 font-normal">vs mês anterior</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm shadow-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Distribuição por Parque</CardTitle>
                    <CardDescription>Volume de retiradas por unidade eólica</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm shadow-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Status do Inventário</CardTitle>
                    <CardDescription>Peças mais retiradas nos últimos 30 dias</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Rolamento', value: 400 },
                            { name: 'Sensor', value: 300 },
                            { name: 'Filtros', value: 300 },
                            { name: 'Placas', value: 200 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || "#0ea5e9"} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "register" && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
              <Card className="border-none shadow-md shadow-slate-200">
                <CardHeader>
                  <CardTitle>Nova Movimentação</CardTitle>
                  <CardDescription>Preencha os campos abaixo para registrar a retirada da peça.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Parque Eólico</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none appearance-none transition-all">
                        <option>Macaúbas</option>
                        <option>Novo Horizonte</option>
                        <option>Seabra</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Aerogerador</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none appearance-none transition-all">
                        <option>Aero 01</option>
                        <option>Aero 02</option>
                        <option>Aero 03</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Peça (Código SAP)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Ex: 1001"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                      />
                      <Search className="absolute right-4 top-3.5 text-slate-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Work Order (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Número da WO"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    />
                  </div>

                  <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-100 transition-all flex items-center justify-center gap-2">
                    <PlusCircle size={20} /> Confirmar Retirada
                  </button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card className="border-none shadow-sm shadow-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Técnico</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Local</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Peça</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">WO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-600">21/08/2026 09:45</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">Bruno Terras</td>
                          <td className="px-6 py-4 text-sm text-slate-600">Macaúbas - Aero 04</td>
                          <td className="px-6 py-4 text-sm text-slate-600">SAP 1001 - Rolamento</td>
                          <td className="px-6 py-4">
                            <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                              WO-8872
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </div>
  );
}
