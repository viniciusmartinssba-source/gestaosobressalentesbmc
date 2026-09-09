import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
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
  Calendar,
  Boxes,
  Sparkles,
  Pencil,
  Trash2,
  RefreshCw
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
import { addMaterial, updateMovimentacao, deleteMovimentacao, generateInsights } from "@/lib/admin.functions";
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
  const { user, logout, isAuthenticated, isLoading: isAuthLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [sapInput, setSapInput] = useState("");
  const [foundPeca, setFoundPeca] = useState<{sap: string, descricao: string} | null>(null);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [pecaSearch, setPecaSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [novoSap, setNovoSap] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);
  const [insights, setInsights] = useState("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [editing, setEditing] = useState<{
    id: string;
    parque_id: string;
    aero: string;
    sap: string;
    quantidade: number;
    wo: string;
    estoque: string;
    data: string;
  } | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  
  
  // Form state
  const [selectedParqueId, setSelectedParqueId] = useState<string>(data.parques[0]?.id || "");
  const [selectedAero, setSelectedAero] = useState<string>(data.parques[0]?.aeros[0]?.toString() || "");
  const [selectedEstoque, setSelectedEstoque] = useState<string>(data.estoques[0] || "");
  const [quantidade, setQuantidade] = useState(1);
  const [wo, setWo] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [dataRetirada, setDataRetirada] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState(initialHistory);

  // Mantém a lista sincronizada com os dados vindos do banco a cada carregamento
  useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

  const handleRefreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      await router.invalidate();
      toast.success("Dashboard atualizado!");
    } catch {
      toast.error("Não foi possível atualizar agora.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddMaterial = async () => {
    setIsSavingMaterial(true);
    try {
      await addMaterial({ data: { sap: novoSap.trim(), descricao: novaDescricao.trim() } });
      toast.success("Material salvo no catálogo!");
      setNovoSap("");
      setNovaDescricao("");
      await router.invalidate();
    } catch (e: any) {
      toast.error(e?.message || "Não foi possível salvar o material.");
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const openEdit = (item: typeof initialHistory[number]) => {
    const parque = data.parques.find(p => p.nome === item.parque);
    const iso = item.dataISO ? new Date(item.dataISO) : new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    setEditing({
      id: item.id,
      parque_id: parque?.id || data.parques[0]?.id || "",
      aero: item.aero,
      sap: item.sap,
      quantidade: item.quantidade,
      wo: item.wo || "",
      estoque: item.estoque || "",
      data: `${iso.getFullYear()}-${pad(iso.getMonth() + 1)}-${pad(iso.getDate())}T${pad(iso.getHours())}:${pad(iso.getMinutes())}`,
    });
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setIsSavingEdit(true);
    try {
      await updateMovimentacao({
        data: {
          id: editing.id,
          parque_id: editing.parque_id,
          aero: editing.aero,
          sap: editing.sap,
          quantidade: Number(editing.quantidade) || 1,
          wo: editing.wo || null,
          estoque: editing.estoque || null,
          data: editing.data ? new Date(editing.data).toISOString() : null,
        },
      });
      toast.success("Lançamento atualizado!");
      setEditing(null);
      await router.invalidate();
    } catch (e: any) {
      toast.error(e?.message || "Não foi possível salvar as alterações.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este lançamento?")) return;
    try {
      await deleteMovimentacao({ data: { id } });
      setHistory(prev => prev.filter(h => h.id !== id));
      toast.success("Lançamento excluído.");
      await router.invalidate();
    } catch (e: any) {
      toast.error(e?.message || "Não foi possível excluir o lançamento.");
    }
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const res = await generateInsights();
      setInsights(res.insights);
    } catch (e: any) {
      toast.error(e?.message || "Não foi possível gerar os insights agora.");
    } finally {
      setIsGeneratingInsights(false);
    }
  };
  
  
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
    if (!sapInput) {
      setFoundPeca(null);
      return;
    }
    const peca = data.catalogo.find(p => p.sap === sapInput);
    setFoundPeca(peca || null);
  }, [sapInput, data.catalogo]);

  const handleFotoChange = (file: File | null) => {
    if (!file) {
      setFoto(null);
      setFotoPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
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
      let fotoPath: string | null = null;
      if (foto) {
        const ext = foto.name.split(".").pop() || "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("movimentacoes-fotos")
          .upload(path, foto, { contentType: foto.type });
        if (uploadError) {
          console.error("Error uploading photo:", uploadError);
          toast.error("Não foi possível enviar a foto. Registro seguirá sem imagem.");
        } else {
          fotoPath = path;
        }
      }

      const { data: mData, error } = await supabase
        .from('movimentacoes')
        .insert({
          tecnico_id: user.id,
          parque_id: selectedParqueId,
          aero: selectedAero.padStart(2, '0'),
          sap: foundPeca.sap,
          quantidade,
          wo,
          estoque: selectedEstoque,
          foto_url: fotoPath,
          ...(dataRetirada ? { data: new Date(dataRetirada).toISOString() } : {})
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
        dataISO: mData.data as string,
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
      setFoto(null);
      setFotoPreview(null);
      setDataRetirada("");
      setActiveTab("history");
    } catch (error) {
      console.error('Error registering movement:', error);
      toast.error("Erro ao registrar movimentação.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleLogout = () => {
    logout();
    toast.info("Você saiu do sistema.");
  };

  

  const criticalParts = useMemo(() => {
    const counts: Record<string, { sap: string; peca: string; total: number }> = {};
    history.forEach(h => {
      const entry = counts[h.sap] || { sap: h.sap, peca: h.peca, total: 0 };
      entry.total += Number(h.quantidade) || 0;
      counts[h.sap] = entry;
    });
    return Object.values(counts).sort((a, b) => b.total - a.total);
  }, [history]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const countToday = history.filter(h => new Date(h.dataISO).getTime() >= today.getTime()).length;
    const countMonth = history.filter(h => new Date(h.dataISO).getTime() >= startOfMonth.getTime()).length;

    // Peça crítica: acumula retiradas por SAP; entra na contagem a partir de 3 unidades
    const criticas = criticalParts.filter(p => p.total >= 3).length;

    return [
      { title: "Total Geral de Saídas", value: history.length.toString(), icon: Package, change: "Atualizado" },
      { title: "Retiradas Hoje", value: countToday.toString(), icon: Calendar, change: "Atualizado" },
      { title: "Retiradas no Mês", value: countMonth.toString(), icon: TrendingUp, change: "Atualizado" },
      { title: "Peças Críticas", value: criticas.toString(), icon: AlertTriangle, change: "3+ retiradas", color: criticas > 0 ? "text-red-500" : "text-foreground" },
    ];
  }, [history, criticalParts]);

  const todayChartData = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const buckets: Record<string, number> = {};
    history
      .filter(h => new Date(h.dataISO).getTime() >= start.getTime())
      .forEach(h => {
        const hora = `${new Date(h.dataISO).getHours().toString().padStart(2, '0')}h`;
        buckets[hora] = (buckets[hora] || 0) + (Number(h.quantidade) || 0);
      });
    return Object.entries(buckets)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [history]);

  const chartData = useMemo(() => data.parques.map(p => ({
    name: p.nome,
    value: history.filter(h => h.parque === p.nome).length
  })), [data.parques, history]);

  const aeroChartData = useMemo(() => {
    const aeroCounts: Record<string, number> = {};
    history.forEach(h => {
      const key = `${h.parque} · Aero ${h.aero}`;
      aeroCounts[key] = (aeroCounts[key] || 0) + 1;
    });
    return Object.entries(aeroCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [history]);

  const pieData = useMemo(
    () => criticalParts.slice(0, 4).map(p => ({ name: p.peca, value: p.total })),
    [criticalParts]
  );

  const handleScan = (sap: string) => {
    setSapInput(sap);
    setIsScannerOpen(false);
  };

  if (isAuthLoading || (isAuthenticated && !user)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <p className="text-sm">Redirecionando para o login...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out">
        <div className="p-6 flex items-center gap-3 border-b border-sidebar-border/50">
          <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg shadow-primary/20 animate-in zoom-in duration-500">
          </div>
          <h1 className="font-bold text-lg leading-tight tracking-tight text-sidebar-foreground">Gestão de<br/>Sobressalentes</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
              activeTab === "overview" 
                ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]" 
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"
            )}
          >
            <LayoutDashboard size={20} className={cn("transition-transform group-hover:scale-110", activeTab === "overview" && "scale-110")} /> 
            <span className="text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab("register")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
              activeTab === "register" 
                ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]" 
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"
            )}
          >
            <PlusCircle size={20} className={cn("transition-transform group-hover:scale-110", activeTab === "register" && "scale-110")} /> 
            <span className="text-sm">Registrar Saída</span>
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
              activeTab === "history" 
                ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]" 
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"
            )}
          >
            <HistoryIcon size={20} className={cn("transition-transform group-hover:scale-110", activeTab === "history" && "scale-110")} /> 
            <span className="text-sm">Histórico</span>
          </button>
          <button 
            onClick={() => setActiveTab("catalog")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
              activeTab === "catalog" 
                ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]" 
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"
            )}
          >
            <Search size={20} className={cn("transition-transform group-hover:scale-110", activeTab === "catalog" && "scale-110")} /> 
            <span className="text-sm">Catálogo</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab("material")}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                activeTab === "material"
                  ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"
              )}
            >
              <Boxes size={20} className="transition-transform group-hover:scale-110" />
              <span className="text-sm">Novo Material</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("ia")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
              activeTab === "ia"
                ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:scale-[1.01]"
            )}
          >
            <Sparkles size={20} className="transition-transform group-hover:scale-110" />
            <span className="text-sm">Insights por IA</span>
          </button>
        </nav>

        <div className="p-4 border-t border-sidebar-border/50 bg-sidebar-accent/10">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl border border-transparent hover:border-sidebar-border transition-colors group">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0 transition-transform group-hover:scale-105">
              {user.nome.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-sidebar-foreground">{user.nome}</p>
              <p className="text-[10px] text-sidebar-foreground/50 font-medium uppercase tracking-wider">{user.matricula}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 text-sm font-medium group cursor-pointer"
          >
            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" /> 
            Sair do Sistema
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
                    <button 
                      onClick={() => { setActiveTab("catalog"); setIsSidebarOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                        activeTab === "catalog" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"
                      )}
                    >
                      <Search size={20} /> Catálogo
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { setActiveTab("material"); setIsSidebarOpen(false); }}
                        className={cn(
                          "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                          activeTab === "material" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"
                        )}
                      >
                        <Boxes size={20} /> Novo Material
                      </button>
                    )}
                    <button
                      onClick={() => { setActiveTab("ia"); setIsSidebarOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
                        activeTab === "ia" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"
                      )}
                    >
                      <Sparkles size={20} /> Insights por IA
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
              {activeTab === "catalog" && "Catálogo"}
              {activeTab === "material" && "Novo Material"}
              {activeTab === "ia" && "Insights por IA"}
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                <div className="bg-primary/10 p-4 rounded-2xl text-primary shadow-inner shrink-0 transition-transform group-hover:scale-110 duration-500">
                  <BarChart3 size={32} />
                </div>
                <div className="flex-1 text-center md:text-left z-10">
                  <h3 className="text-xl font-bold text-foreground">Insights Estratégicos</h3>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleRefreshDashboard}
                  disabled={isRefreshing}
                  className="w-full md:w-auto rounded-xl px-6 font-semibold shadow-sm hover:scale-105 transition-transform cursor-pointer"
                >
                  <RefreshCw size={18} className={cn(isRefreshing && "animate-spin")} />
                  {isRefreshing ? "Atualizando..." : "Atualizar Dashboard"}
                </Button>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="rounded-3xl border-border bg-card/50 backdrop-blur-sm shadow-none hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                          <h3 className={cn("text-3xl font-extrabold tracking-tight transition-colors", stat.color || "text-foreground")}>{stat.value}</h3>
                        </div>
                        <div className="bg-accent/50 p-3 rounded-2xl text-primary transition-transform group-hover:rotate-12">
                          <stat.icon size={24} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 w-fit px-3 py-1 rounded-full">
                        <TrendingUp size={12} />
                        {stat.change} <span className="text-emerald-700/70 font-medium">vs mês anterior</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-border shadow-none p-6 bg-card/50 backdrop-blur-sm lg:col-span-2">
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="text-lg font-bold">Retiradas de Hoje</CardTitle>
                    <CardDescription>Quantidade de peças retiradas por horário no dia de hoje</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[280px] p-0">
                    {todayChartData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                        Nenhuma retirada registrada hoje.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={todayChartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} dy={10} />
                          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                          <Tooltip
                            cursor={{fill: 'var(--accent)', opacity: 0.2}}
                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                          />
                          <Bar dataKey="value" name="Peças" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={36} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-border shadow-none p-6 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="text-lg font-bold">Distribuição por Parque</CardTitle>
                    <CardDescription>Volume de retiradas por unidade eólica</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] p-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: 'var(--muted-foreground)', fontSize: 12}} 
                          dy={10} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: 'var(--muted-foreground)', fontSize: 12}} 
                        />
                        <Tooltip 
                          cursor={{fill: 'var(--accent)', opacity: 0.2}}
                          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-border shadow-none p-6 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="text-lg font-bold">Uso por Aerogerador</CardTitle>
                    <CardDescription>Top 5 aerogeradores com mais movimentações</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] p-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={aeroChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.4} />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: 'var(--muted-foreground)', fontSize: 12}}
                        />
                        <Tooltip 
                          cursor={{fill: 'var(--accent)', opacity: 0.2}}
                          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 6, 6, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-border shadow-none p-6 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="text-lg font-bold">Peças Críticas</CardTitle>
                    <CardDescription>Peças com maior acúmulo de retiradas</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] p-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="40%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || "#0ea5e9"} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "register" && (
            <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in zoom-in-95 duration-200 px-0 sm:px-4">
              <Card className="border-none shadow-md shadow-border overflow-hidden rounded-none sm:rounded-2xl bg-card text-card-foreground">
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle>Nova Movimentação</CardTitle>
                  <CardDescription className="text-primary-foreground/80">Preencha os campos abaixo para registrar a retirada da peça.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Parque Eólico <span className="text-destructive">*</span></Label>
                      <Select 
                        value={selectedParqueId}
                        onValueChange={(val) => {
                          setSelectedParqueId(val);
                          const p = data.parques.find(p => p.id === val);
                          if (p) setSelectedAero(p.aeros[0]!.toString());
                        }}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 text-black">
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
                      <Label>Aerogerador <span className="text-destructive">*</span></Label>
                      <Select 
                        value={selectedAero}
                        onValueChange={setSelectedAero}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 text-black">
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
                    <Label>Código SAP da Peça <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={sapInput}
                          onChange={(e) => setSapInput(e.target.value.trim())}
                          placeholder="Digite o código SAP"
                          className={cn(
                            "h-12 rounded-xl bg-slate-50 pr-10 text-black font-mono",
                            foundPeca && "border-emerald-500 ring-emerald-500",
                            sapInput && !foundPeca && "border-destructive"
                          )}
                        />
                        {foundPeca ? (
                          <CheckCircle2 className="absolute right-3 top-3 text-emerald-500" size={20} />
                        ) : (
                          <Package className="absolute right-3 top-3 text-slate-400" size={20} />
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setIsScannerOpen(true)}
                        className="h-12 w-12 rounded-xl shrink-0"
                      >
                        <Camera size={24} className="text-slate-600" />
                      </Button>
                    </div>
                    {foundPeca ? (
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-1">
                        <p className="text-sm text-emerald-700 font-medium">{foundPeca.descricao}</p>
                      </div>
                    ) : sapInput ? (
                      <p className="text-xs text-destructive font-medium">
                        Código SAP não encontrado no catálogo.
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>Consultar Peça (por código ou nome)</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={pecaSearch}
                        onChange={(e) => setPecaSearch(e.target.value)}
                        placeholder="Ex.: 28477 ou BASE RELE"
                        className="h-12 rounded-xl bg-slate-50 pr-10 text-black"
                      />
                      <Search className="absolute right-3 top-3 text-slate-400" size={20} />
                      {pecaSearch.trim().length >= 2 && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg max-h-56 overflow-y-auto overflow-x-hidden">
                          {data.catalogo
                            .filter(p =>
                              p.sap.toLowerCase().includes(pecaSearch.trim().toLowerCase()) ||
                              p.descricao.toLowerCase().includes(pecaSearch.trim().toLowerCase())
                            )
                            .slice(0, 8)
                            .map(p => (
                              <button
                                key={p.sap}
                                type="button"
                                className="w-full text-left p-3 hover:bg-accent/50 transition-colors border-b border-border/50 last:border-0"
                                onClick={() => {
                                  setSapInput(p.sap);
                                  setFoundPeca(p);
                                  setPecaSearch("");
                                }}
                              >
                                <div className="font-mono text-xs font-bold text-primary">{p.sap}</div>
                                <div className="text-sm truncate">{p.descricao}</div>
                              </button>
                            ))}
                          {data.catalogo.filter(p =>
                            p.sap.toLowerCase().includes(pecaSearch.trim().toLowerCase()) ||
                            p.descricao.toLowerCase().includes(pecaSearch.trim().toLowerCase())
                          ).length === 0 && (
                            <p className="p-3 text-sm text-muted-foreground">Nenhuma peça encontrada.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantidade</Label>
                      <Input 
                        type="number" 
                        value={quantidade}
                        onChange={(e) => setQuantidade(Number(e.target.value))}
                        className="h-12 rounded-xl bg-background"
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estoque (Opcional)</Label>
                      <Select value={selectedEstoque} onValueChange={setSelectedEstoque}>
                        <SelectTrigger className="h-12 rounded-xl bg-background">
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
                      className="h-12 rounded-xl bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data e Hora da Retirada (Opcional)</Label>
                    <Input
                      type="datetime-local"
                      value={dataRetirada}
                      onChange={(e) => setDataRetirada(e.target.value)}
                      className="h-12 rounded-xl bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Se deixar em branco, será registrado o horário da confirmação da retirada.
                    </p>
                  </div>


                  <div className="space-y-2">
                    <Label>Foto da Peça (Opcional)</Label>
                    {fotoPreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-border">
                        <img
                          src={fotoPreview}
                          alt="Pré-visualização da foto da peça"
                          className="w-full max-h-56 object-cover"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={() => handleFotoChange(null)}
                          className="absolute top-2 right-2 h-9 w-9 rounded-lg"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="foto-peca"
                        className="flex flex-col items-center justify-center gap-2 h-28 rounded-xl border border-dashed border-border bg-background cursor-pointer hover:bg-accent/40 transition-colors"
                      >
                        <Camera size={22} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Toque para tirar ou anexar uma foto
                        </span>
                      </label>
                    )}
                    <input
                      id="foto-peca"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFotoChange(e.target.files?.[0] ?? null)}
                    />
                    {foto && (
                      <p className="text-xs text-muted-foreground truncate">{foto.name}</p>
                    )}
                  </div>

                  <Button 
                    onClick={handleRegister}
                    disabled={!selectedParqueId || !selectedAero || !foundPeca || isSubmitting}
                    className="w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <PlusCircle size={20} /> {isSubmitting ? "Registrando..." : "Confirmar Retirada"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-bold text-foreground">Registros Recentes</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    onClick={() => exportToXLSX(history)}
                    className="flex-1 sm:flex-none rounded-xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                  >
                    <FileDown size={18} /> Excel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => exportToPDF(history)}
                    className="flex-1 sm:flex-none rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                  >
                    <FileDown size={18} /> PDF
                  </Button>
                </div>
              </div>
              
              <Card className="border-none shadow-sm shadow-border bg-card text-card-foreground">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-bold whitespace-nowrap">Data</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">Técnico</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">Local</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">Peça</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">Qtd</TableHead>
                        <TableHead className="font-bold text-right whitespace-nowrap">WO</TableHead>
                        {isAdmin && <TableHead className="font-bold text-right whitespace-nowrap">Ações</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id} className="group">
                        <TableCell className="text-muted-foreground text-xs">{item.data}</TableCell>
                        <TableCell className="font-medium">{item.tecnico}</TableCell>
                        <TableCell className="text-muted-foreground">{item.parque} - {item.aero}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.peca}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">SAP {item.sap}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-lg">{item.quantidade}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.wo ? (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-lg">
                              {item.wo}
                            </Badge>
                          ) : (
                            <span className="text-muted/30 text-xs">-</span>
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
                                onClick={() => openEdit(item)}
                                aria-label="Editar lançamento"
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(item.id)}
                                aria-label="Excluir lançamento"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "catalog" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 w-full sm:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      placeholder="Buscar por SAP ou Nome da Peça..." 
                      className="pl-10 h-11 rounded-xl bg-card border-border"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                    />
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none rounded-xl"
                      onClick={() => setActiveTab("material")}
                    >
                      <Boxes size={18} /> Novo Material
                    </Button>
                  </div>
                )}

              </div>

              <Card className="border-none shadow-sm shadow-border bg-card text-card-foreground">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-bold w-32">Código SAP</TableHead>
                        <TableHead className="font-bold">Descrição do Material</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.catalogo
                        .filter(p => 
                          p.sap.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                          p.descricao.toLowerCase().includes(catalogSearch.toLowerCase())
                        )
                        .map((peca, i) => (
                          <TableRow key={peca.sap} className="group">
                            <TableCell className="font-mono font-bold text-primary">{peca.sap}</TableCell>
                            <TableCell className="font-medium">{peca.descricao}</TableCell>
                          </TableRow>
                        ))
                      }
                      {data.catalogo.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                            Nenhum material cadastrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {/* Novo Material (Admin) */}
          {activeTab === "material" && isAdmin && (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
              <Card className="border-none shadow-md shadow-border overflow-hidden rounded-2xl bg-card text-card-foreground">
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle>Cadastrar Novo Material</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Adicione ao catálogo uma peça recém-cadastrada no almoxarifado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label>Código SAP <span className="text-destructive">*</span></Label>
                    <Input
                      value={novoSap}
                      onChange={(e) => setNovoSap(e.target.value.trim())}
                      placeholder="Ex.: 1000284"
                      className="h-12 rounded-xl bg-background font-mono"
                    />
                    {novoSap && data.catalogo.some(p => p.sap === novoSap) && (
                      <p className="text-xs text-amber-500 font-medium">
                        Este código já existe no catálogo e será atualizado.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição do Material <span className="text-destructive">*</span></Label>
                    <Input
                      value={novaDescricao}
                      onChange={(e) => setNovaDescricao(e.target.value)}
                      placeholder="Ex.: BASE RELE 14 PINOS"
                      className="h-12 rounded-xl bg-background"
                    />
                  </div>
                  <Button
                    className="w-full h-14 rounded-xl font-bold text-lg"
                    disabled={!novoSap.trim() || !novaDescricao.trim() || isSavingMaterial}
                    onClick={handleAddMaterial}
                  >
                    <Boxes size={20} /> {isSavingMaterial ? "Salvando..." : "Salvar no Catálogo"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Insights IA */}
          {activeTab === "ia" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Insights por IA</h3>
                  <p className="text-sm text-muted-foreground">
                    Análise automática das retiradas registradas no sistema.
                  </p>
                </div>
                <Button
                  className="rounded-xl font-semibold w-full sm:w-auto"
                  onClick={handleGenerateInsights}
                  disabled={isGeneratingInsights}
                >
                  <Sparkles size={18} /> {isGeneratingInsights ? "Analisando..." : "Gerar Insights"}
                </Button>
              </div>

              <Card className="rounded-3xl border-border bg-card/50 backdrop-blur-sm p-6">
                {isGeneratingInsights ? (
                  <p className="text-sm text-muted-foreground animate-pulse">
                    A IA está analisando as movimentações. Isso pode levar alguns instantes...
                  </p>
                ) : insights ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{insights}</div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Clique em "Gerar Insights" para que a IA analise as retiradas e aponte peças críticas,
                    tendências e recomendações de reposição.
                  </p>
                )}
              </Card>
            </div>
          )}

          {/* Modal de edição de lançamento (Admin) */}
          {editing && (
            <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <Card className="w-full max-w-lg rounded-3xl overflow-hidden border-none shadow-2xl">
                <CardHeader className="bg-primary text-primary-foreground p-6 flex-row items-center justify-between">
                  <CardTitle className="text-xl">Editar Lançamento</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setEditing(null)} className="text-primary-foreground hover:bg-white/10 rounded-full">
                    <X size={22} />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label>Parque Eólico</Label>
                    <Select
                      value={editing.parque_id}
                      onValueChange={(val) => {
                        const p = data.parques.find(pp => pp.id === val);
                        setEditing({ ...editing, parque_id: val, aero: p?.aeros[0]?.toString().padStart(2, '0') || editing.aero });
                      }}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 text-black"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {data.parques.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Aerogerador</Label>
                    <Select value={editing.aero} onValueChange={(val) => setEditing({ ...editing, aero: val })}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 text-black"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(data.parques.find(p => p.id === editing.parque_id)?.aeros ?? []).map((a: number) => (
                          <SelectItem key={a} value={a.toString().padStart(2, '0')}>Aero {a.toString().padStart(2, '0')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Código SAP</Label>
                    <Input
                      value={editing.sap}
                      onChange={(e) => setEditing({ ...editing, sap: e.target.value.trim() })}
                      className="h-12 rounded-xl bg-slate-50 text-black font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      {data.catalogo.find(p => p.sap === editing.sap)?.descricao || "Código não encontrado no catálogo."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        min={1}
                        value={editing.quantidade}
                        onChange={(e) => setEditing({ ...editing, quantidade: Number(e.target.value) })}
                        className="h-12 rounded-xl bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Work Order</Label>
                      <Input
                        value={editing.wo}
                        onChange={(e) => setEditing({ ...editing, wo: e.target.value })}
                        className="h-12 rounded-xl bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Data e Hora</Label>
                    <Input
                      type="datetime-local"
                      value={editing.data}
                      onChange={(e) => setEditing({ ...editing, data: e.target.value })}
                      className="h-12 rounded-xl bg-background"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setEditing(null)}>Cancelar</Button>
                    <Button className="flex-[2] rounded-xl h-12 font-bold" onClick={handleSaveEdit} disabled={isSavingEdit}>
                      {isSavingEdit ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </CardContent>
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
