import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { getInitialData } from "@/lib/data.functions";
import { resetUserPasswords } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Wind } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans sm:p-6 lg:p-8">
      <Card className="w-full max-w-sm sm:max-w-md border-none shadow-2xl shadow-slate-200">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto bg-primary p-3 rounded-2xl text-primary-foreground w-fit shadow-lg shadow-primary/20">
            <Wind size={32} />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-foreground">Gestão de Sobressalentes</CardTitle>
            <CardDescription>
              Acesse o painel operacional para registro de peças.
              <br />
              <span className="text-[10px] mt-2 block opacity-70">
                valide a senha e usuário de todos...
                <br />
                Por exemplo: Usuário: u39920 / Senha: U39920
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input 
                id="matricula"
                type="text" 
                placeholder="Ex: U57097"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input 
                id="senha"
                type="password" 
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="h-12 rounded-xl"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold text-lg shadow-lg shadow-primary/20 transition-all text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Entrar no Sistema"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Caso tenha esquecido sua senha, entre em contato com o suporte de TI.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="w-full text-[10px] opacity-20 hover:opacity-100"
                onClick={async () => {
                  const res = await resetUserPasswords();
                  console.log("Reset results:", res);
                  toast.success("Senhas resetadas (ver console)");
                }}
              >
                Debug: Resetar Senhas (Matrícula)
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
