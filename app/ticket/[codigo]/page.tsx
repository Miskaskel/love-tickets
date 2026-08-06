import { createServerClient } from "@/lib/supabase/server";
import { Ticket } from "@/lib/types";
import { ThemeStage } from "@/components/ticket/theme-stage";
import { TicketStub } from "@/components/ticket/ticket-stub";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ codigo: string }>;
}

async function getTicketEUsuario(codigo: string) {
  const supabase = await createServerClient();

  const [{ data: ticket }, { data: userData }] = await Promise.all([
    supabase.from("tickets").select("*").eq("codigo", codigo).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  return { ticket: ticket as Ticket | null, user: userData.user };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const { ticket } = await getTicketEUsuario(codigo);
  return {
    title: ticket ? `${ticket.titulo} · Love Ticket` : "Love Ticket",
  };
}

export default async function TicketPage({ params }: Props) {
  const { codigo } = await params;
  const { ticket, user } = await getTicketEUsuario(codigo);

  if (!ticket) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-cream-200 paper-texture px-6 text-center">
        <Heart className="w-8 h-8 text-wine-500/40 mb-4" />
        <h1 className="font-display text-2xl text-ink/70 mb-2">Ticket não encontrado</h1>
        <p className="text-sm text-ink/50 font-body mb-6">
          Este código não corresponde a nenhum Love Ticket válido.
        </p>
        <Link
          href="/"
          className="font-label text-xs tracking-[0.15em] uppercase text-wine-500 underline underline-offset-4"
        >
          Voltar ao início
        </Link>
      </main>
    );
  }

  const isLoggedIn = !!user;
  const isOwner = !!user && user.id === ticket.user_id;

  return (
    <ThemeStage tema={ticket.tema}>
      <TicketStub ticket={ticket} isLoggedIn={isLoggedIn} isOwner={isOwner} />
    </ThemeStage>
  );
}
