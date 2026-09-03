import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { getInitialData } from "@/lib/data.functions";
import { toast } from "sonner";
import { Wind, User, Lock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_auth/login")({
  beforeLoad: ({ context }) => {
    // If we had the auth status in context, we could redirect here.
    // For now, handled in the component for simplicity in this prototype.
  },
  loader: async () => getInitialData(),
  component: LoginPage,
});

function LoginPage() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const data = Route.useLoaderData();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const tecnico = data.tecnicos.find(t => t.matricula.toLowerCase() === matricula.toLowerCase());
      
      if (tecnico) {
        const { error } = await login(tecnico.email, senha);
        
        if (error) {
          toast.error("Credenciais inválidas. Verifique sua matrícula e senha.");
        } else {
          toast.success(`Bem-vindo, ${tecnico.nome}!`);
          navigate({ to: "/" });
        }
      } else {
        toast.error("Matrícula não encontrada.");
      }
    } catch (error) {
      toast.error("Erro ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden font-sans">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/40 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative z-10 animate-in zoom-in duration-500">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center border-b border-border/50 bg-accent/30">
          <div className="mx-auto bg-primary w-16 h-16 flex items-center justify-center rounded-2xl text-primary-foreground shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-0 duration-300">
            <Wind size={32} />
          </div>
          <div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">Gestão de Sobressalentes</CardTitle>
            <CardDescription className="text-muted-foreground mt-2 font-medium">
              Acesse o painel operacional para registro de peças
            </CardDescription>
            <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 text-[11px] text-primary/70 font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Portal do Técnico
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 px-1">Matrícula</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input 
                  id="matricula"
                  type="text" 
                  placeholder="Ex: U57097"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                  required
                  className="pl-11 h-12 rounded-xl bg-background border-border focus:ring-primary/20 transition-all text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 px-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input 
                  id="senha"
                  type="password" 
                  placeholder="Sua senha de acesso"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="pl-11 h-12 rounded-xl bg-background border-border focus:ring-primary/20 transition-all text-base"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-13 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer bg-primary text-primary-foreground" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </div>
              ) : "Entrar no Painel"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
