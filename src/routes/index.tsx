import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
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
  Users,
  Calendar
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
  Legend
} from "recharts";
import { getInitialData, getHistory } from "@/lib/data.functions";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { exportToPDF, exportToXLSX } from "@/lib/reports";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/")({
  component: Dashboard,
  loader: async () => {
    const [data, history] = await Promise.all([
      getInitialData(),
      getHistory()
    ]);
    return { data, history };
  },
});

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];

function Dashboard() {
  const { data, history: initialHistory } = Route.useLoaderData();
  const { user, logout, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [sapInput, setSapInput] = useState("");
  const [foundPeca, setFoundPeca] = useState<{sap: string, descricao: string} | null>(null);
  
  // Form state
  const [selectedParqueId, setSelectedParqueId] = useState<string>(data.parques[0]?.id || "");
  const [selectedAero, setSelectedAero] = useState<string>(data.parques[0]?.aeros[0]?.toString() || "");
  const [selectedEstoque, setSelectedEstoque] = useState<string>(data.estoques[0] || "");
  const [quantidade, setQuantidade] = useState(1);
  const [wo, setWo] = useState("");
  const [history, setHistory] = useState(initialHistory);
  
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const selectedParque = useMemo(() => 
    data.parques.find(p => p.id === selectedParqueId) || data.parques[0],
    [data.parques, selectedParqueId]
  );

  useEffect(() => {
    const peca = data.catalogo.find(p => p.sap === sapInput);
    setFoundPeca(peca || null);
  }, [sapInput, data.catalogo]);

  const handleRegister = async () => {
    if (!foundPeca || !user) return;
    
    try {
      const { data: mData, error } = await supabase
        .from('movimentacoes')
        .insert({
          tecnico_id: user.id,
          parque_id: selectedParqueId,
          aero: selectedAero.padStart(2, '0'),
          sap: foundPeca.sap,
          quantidade,
          wo,
          estoque: selectedEstoque
        })
        .select(`
          *,
          profiles (nome),
          parques (nome),
          pecas (sap, descricao)
        `)
        .single();

      if (error) throw error;

      const newEntry = {
        id: mData.id,
        data: new Date(mData.data!).toLocaleString('pt-BR'),
        tecnico: mData.profiles?.nome || user.nome,
        parque: mData.parques?.nome || (selectedParque?.nome || ""),
        aero: mData.aero,
        sap: mData.sap,
        peca: mData.pecas?.descricao || foundPeca.descricao,
        quantidade: mData.quantidade,
        wo: mData.wo || "",
        estoque: mData.estoque || ""
      };
      
      setHistory([newEntry, ...history]);
      toast.success("Movimentação registrada com sucesso!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#6366f1']
      });
      
      setSapInput("");
      setQuantidade(1);
      setWo("");
      setActiveTab("history");
    } catch (error) {
      console.error('Error registering movement:', error);
      toast.error("Erro ao registrar movimentação.");
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("Você saiu do sistema.");
  };

  if (!isAuthenticated || !user) return null;

  const stats = [
    { title: "Total de Saídas", value: history.length.toString(), icon: Package, change: "+12%" },
    { title: "Peças Críticas", value: "14", icon: AlertTriangle, change: "-2", color: "text-red-500" },
    { title: "Uso de WO", value: "85%", icon: TrendingUp, change: "+5%" },
  ];

  const chartData = useMemo(() => data.parques.map(p => ({
    name: p.nome,
    value: history.filter(h => h.parque === p.nome).length
  })), [data.parques, history]);

  const pieData = useMemo(() => [
    { name: 'Mecânico', value: 400 },
    { name: 'Elétrico', value: 300 },
    { name: 'Sensores', value: 200 },
    { name: 'Outros', value: 100 },
  ], []);

  const handleScan = (sap: string) => {
    setSapInput(sap);
    setIsScannerOpen(false);
  };
  return (
    <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-primary p-2 rounded-lg text-primary-foreground">
            <Wind size={24} />
          </div>
          <h1 className="font-bold text-lg leading-tight">Gestão de<br/>Sobressalentes</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
              activeTab === "overview" ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
            )}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("register")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
              activeTab === "register" ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
            )}
          >
            <PlusCircle size={20} /> Registrar Saída
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
              activeTab === "history" ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
            )}
          >
            <HistoryIcon size={20} /> Histórico
          </button>
          <button 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          >
            <Search size={20} /> Catálogo
          </button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center font-bold text-sidebar-foreground shrink-0">
              {user.nome.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.nome}</p>
              <p className="text-xs text-sidebar-foreground/50">{user.matricula}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SheetHeader className="p-6 flex-row items-center gap-3 border-b border-slate-100 text-left">
                  <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                    <Wind size={24} />
                  </div>
                  <SheetTitle className="font-bold text-lg leading-tight">Gestão de<br/>Sobressalentes</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-[calc(100vh-85px)]">
                  <nav className="flex-1 p-4 space-y-1">
                    <button 
                      onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                        activeTab === "overview" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"
                      )}
                    >
                      <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button 
                      onClick={() => { setActiveTab("register"); setIsSidebarOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                        activeTab === "register" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"
                      )}
                    >
                      <PlusCircle size={20} /> Registrar Saída
                    </button>
                    <button 
                      onClick={() => { setActiveTab("history"); setIsSidebarOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                        activeTab === "history" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"
                      )}
                    >
                      <HistoryIcon size={20} /> Histórico
                    </button>
                  </nav>
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground shrink-0">
                        {user.nome.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.nome}</p>
                        <p className="text-xs text-muted-foreground">{user.matricula}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <LogOut size={18} /> Sair
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <h2 className="text-sm md:text-lg font-semibold uppercase tracking-wider text-muted-foreground truncate max-w-[200px] md:max-w-none">
              {activeTab === "overview" && "Dashboard"}
              {activeTab === "register" && "Registro"}
              {activeTab === "history" && "Histórico"}
            </h2>
          </div>
          <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Calendar size={16} className="hidden sm:block" />
            <span className="hidden sm:block">
              {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="sm:hidden">
              {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: '2-digit' })}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-accent border border-border rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="bg-primary p-3 md:p-4 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
                  <BarChart3 size={28} className="md:w-8 md:h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">Insights da IA</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {history.length > 0 ? (
                      `Análise baseada em ${history.length} registros: O parque ${chartData.sort((a,b) => b.value - a.value)[0]?.name} possui o maior volume de retiradas. Verifique a periodicidade de manutenção preventiva.`
                    ) : (
                      "Nenhum dado de movimentação disponível para análise de IA no momento."
                    )}
                  </p>
                </div>
                <Button variant="secondary" className="w-full md:w-auto">
                  Ver Detalhes
                </Button>
              </div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm shadow-border overflow-hidden bg-card text-card-foreground">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                          <h3 className={cn("text-xl md:text-2xl font-bold", stat.color || "text-foreground")}>{stat.value}</h3>
                        </div>
                        <div className="bg-accent p-2 md:p-2.5 rounded-xl">
                          <stat.icon className="text-primary" size={20} />
                        </div>
                      </div>
                      <div className="mt-3 md:mt-4 flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-full">
                        {stat.change} <span className="text-muted-foreground font-normal">vs mês anterior</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card className="border-none shadow-sm shadow-border bg-card text-card-foreground">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base md:text-lg">Distribuição por Parque</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Volume de retiradas por unidade eólica</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] md:h-80 px-2 md:px-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: 'var(--muted-foreground)', fontSize: 10}} 
                          dy={10} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: 'var(--muted-foreground)', fontSize: 10}} 
                        />
                        <Tooltip 
                          cursor={{fill: 'var(--accent)'}}
                          contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: 'var(--card)', color: 'var(--card-foreground)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                        />
                        <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
 
                <Card className="border-none shadow-sm shadow-border bg-card text-card-foreground">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base md:text-lg">Status do Inventário</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Peças mais retiradas nos últimos 30 dias</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-[300px] md:h-80 px-2 md:px-6">
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
                          innerRadius={window.innerWidth < 768 ? 50 : 60}
                          outerRadius={window.innerWidth < 768 ? 70 : 80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || "#0ea5e9"} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                        <Legend wrapperStyle={{fontSize: '12px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "register" && (
            <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in zoom-in-95 duration-200 px-0 sm:px-4">
              <Card className="border-none shadow-md shadow-slate-200 overflow-hidden rounded-none sm:rounded-2xl">
                <CardHeader className="bg-sky-700 text-white">
                  <CardTitle>Nova Movimentação</CardTitle>
                  <CardDescription className="text-sky-100">Preencha os campos abaixo para registrar a retirada da peça.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Parque Eólico</Label>
                      <Select 
                        value={selectedParqueId}
                        onValueChange={(val) => {
                          setSelectedParqueId(val);
                          const p = data.parques.find(p => p.id === val);
                          if (p) setSelectedAero(p.aeros[0]!.toString());
                        }}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50">
                          <SelectValue placeholder="Selecione o parque" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.parques.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Aerogerador</Label>
                      <Select 
                        value={selectedAero}
                        onValueChange={setSelectedAero}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50">
                          <SelectValue placeholder="Selecione o aero" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedParque?.aeros.map((a: number) => (
                            <SelectItem key={a} value={a.toString()}>Aero {a.toString().padStart(2, '0')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Peça (Código SAP)</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input 
                          type="text" 
                          value={sapInput}
                          onChange={(e) => setSapInput(e.target.value)}
                          placeholder="Ex: 1001"
                          className={cn(
                            "h-12 rounded-xl bg-slate-50 pr-10",
                            foundPeca && "border-emerald-500 ring-emerald-500"
                          )}
                        />
                        {foundPeca ? (
                          <CheckCircle2 className="absolute right-3 top-3 text-emerald-500" size={20} />
                        ) : (
                          <Search className="absolute right-3 top-3 text-slate-400" size={20} />
                        )}
                      </div>
                      <Button 
                        variant="secondary"
                        size="icon"
                        onClick={() => setIsScannerOpen(true)}
                        className="h-12 w-12 rounded-xl"
                      >
                        <Camera size={24} className="text-slate-600" />
                      </Button>
                    </div>
                    {foundPeca && (
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-1">
                        <p className="text-sm text-emerald-700 font-medium">
                          {foundPeca.descricao}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantidade</Label>
                      <Input 
                        type="number" 
                        value={quantidade}
                        onChange={(e) => setQuantidade(Number(e.target.value))}
                        className="h-12 rounded-xl bg-slate-50"
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estoque (Opcional)</Label>
                      <Select value={selectedEstoque} onValueChange={setSelectedEstoque}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {data.estoques.map(e => (
                            <SelectItem key={e} value={e}>Estoque {e}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Work Order (Opcional)</Label>
                    <Input 
                      type="text" 
                      value={wo}
                      onChange={(e) => setWo(e.target.value)}
                      placeholder="Número da WO"
                      className="h-12 rounded-xl bg-slate-50"
                    />
                  </div>

                  <Button 
                    onClick={handleRegister}
                    disabled={!foundPeca}
                    className="w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-sky-100 transition-all"
                  >
                    <PlusCircle size={20} /> Confirmar Retirada
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-bold text-slate-800">Registros Recentes</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    onClick={() => exportToXLSX(history)}
                    className="flex-1 sm:flex-none rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <FileDown size={18} /> Excel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => exportToPDF(history)}
                    className="flex-1 sm:flex-none rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <FileDown size={18} /> PDF
                  </Button>
                </div>
              </div>
              
              <Card className="border-none shadow-sm shadow-slate-200">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-bold whitespace-nowrap">Data</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">Técnico</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">Local</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">Peça</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">Qtd</TableHead>
                        <TableHead className="font-bold text-right whitespace-nowrap">WO</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {history.map((item, i) => (
                      <TableRow key={i} className="group">
                        <TableCell className="text-slate-500 text-xs">{item.data}</TableCell>
                        <TableCell className="font-medium">{item.tecnico}</TableCell>
                        <TableCell className="text-slate-600">{item.parque} - {item.aero}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.peca}</span>
                            <span className="text-[10px] text-slate-400 font-mono">SAP {item.sap}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-lg">{item.quantidade}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.wo ? (
                            <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 border-none rounded-lg">
                              {item.wo}
                            </Badge>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {isScannerOpen && (
        <BarcodeScanner 
          onScan={handleScan}
          onClose={() => setIsScannerOpen(false)}
        />
      )}
    </div>
  );
}
