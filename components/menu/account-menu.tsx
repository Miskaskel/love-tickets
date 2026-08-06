"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function AccountMenu({ nome, email }: { nome: string; email: string }) {
  const router = useRouter();
  const [senhaOpen, setSenhaOpen] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleTrocarSenha(e: React.FormEvent) {
    e.preventDefault();
    if (novaSenha.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    setLoading(false);

    if (error) {
      toast.error("Não foi possível trocar a senha.");
      return;
    }

    toast.success("Senha atualizada.");
    setSenhaOpen(false);
    setNovaSenha("");
    setConfirmarSenha("");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="max-w-[10rem]">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{nome}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {email && (
            <>
              <p className="px-2.5 pt-1.5 pb-2 text-[10px] font-body text-ink/40 truncate">
                {email}
              </p>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onSelect={() => setSenhaOpen(true)}>
            <KeyRound className="w-3.5 h-3.5" />
            Trocar senha
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={senhaOpen} onOpenChange={setSenhaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trocar senha</DialogTitle>
            <DialogDescription>Escolha uma nova senha para sua conta.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTrocarSenha} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nova-senha">Nova senha</Label>
              <Input
                id="nova-senha"
                type="password"
                minLength={6}
                required
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmar-nova-senha">Confirmar nova senha</Label>
              <Input
                id="confirmar-nova-senha"
                type="password"
                minLength={6}
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
