"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cadastrarUsuario } from "@/app/signup/actions";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("nome", nome);
        formData.set("email", email);
        formData.set("senha", senha);

        const resultado = await cadastrarUsuario(formData);

        if (resultado?.precisaConfirmarEmail) {
          toast.success("Conta criada! Confira seu e-mail para confirmar antes de entrar.");
          router.push("/login");
          return;
        }

        // Conta criada e já com sessão ativa (confirmação de e-mail desligada) —
        // faz login automático no navegador também, pra manter tudo em sincronia.
        const supabase = createClient();
        await supabase.auth.signInWithPassword({ email, password: senha });

        toast.success("Conta criada! Bem-vindo(a).");
        router.push("/menu");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Não foi possível criar a conta.");
      }
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-200 paper-texture px-6">
      <Card className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <Link
            href="/"
            className="flex flex-col items-center group"
            aria-label="Voltar para o início"
          >
            <Heart
              className="w-6 h-6 text-wine-500 mb-2 transition-transform group-hover:scale-110"
              fill="currentColor"
            />
            <h1 className="font-label text-sm tracking-[0.2em] uppercase text-wine-500 group-hover:opacity-80 transition-opacity">
              Love Tickets
            </h1>
          </Link>
          <p className="text-xs text-ink/50 font-body mt-1">Criar sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              type="text"
              autoComplete="name"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmarSenha">Confirmar senha</Label>
            <Input
              id="confirmarSenha"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-center text-xs text-ink/50 font-body mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-wine-500 underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </Card>
    </main>
  );
}
