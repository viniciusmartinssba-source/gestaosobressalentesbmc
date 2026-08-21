import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { getInitialData } from "@/lib/data.functions";
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
        // In a real app, we'd verify the password on the server
        login(tecnico);
        toast.success(`Bem-vindo, ${tecnico.nome}!`);
        navigate({ to: "/" });
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md border-none shadow-2xl shadow-slate-200">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto bg-sky-600 p-3 rounded-2xl text-white w-fit shadow-lg shadow-sky-100">
            <Wind size={32} />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-slate-900">Gestão de Sobressalentes</CardTitle>
            <CardDescription>Acesse o painel operacional para registro de peças</CardDescription>
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
              className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 font-bold text-lg shadow-lg shadow-sky-100 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Entrar no Sistema"}
            </Button>
            <p className="text-center text-xs text-slate-400">
              Caso tenha esquecido sua senha, entre em contato com o suporte de TI.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
