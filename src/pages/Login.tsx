import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import loginHero from "@/assets/login-hero.webp";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, session } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (session) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro ao entrar",
        description: error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-16 xl:px-24"
      >
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              ISO<span className="text-primary">-GESSO</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Plataforma de Inteligência Acústica
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Right - Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative hidden md:flex md:w-1/2 items-end overflow-hidden"
      >
        <img
          src={loginHero}
          alt="Técnico instalando isolamento acústico"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/95 via-sidebar/40 to-transparent" />
        <div className="relative z-10 p-12">
          <blockquote className="text-2xl font-semibold leading-tight text-sidebar-foreground">
            "Transformando silêncio em performance acústica"
          </blockquote>
          <p className="mt-3 text-sm text-sidebar-foreground/70">
            Engenharia acústica de precisão · Controle inteligente de materiais
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
