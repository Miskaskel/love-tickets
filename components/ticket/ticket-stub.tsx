"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Ticket, TEMA_LABELS } from "@/lib/types";
import { Stamp } from "@/components/ticket/stamp";
import { Button } from "@/components/ui/button";
import { marcarComoUtilizado, reativarTicket } from "@/app/menu/actions";
import { Heart, ArrowLeft, CheckCircle2, RotateCcw, LogIn } from "lucide-react";
import { toast } from "sonner";

function formatarDataHora(iso: string) {
  const d = new Date(iso);
  const data = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { data, hora };
}

export function TicketStub({
  ticket,
  isLoggedIn = false,
  isOwner = false,
}: {
  ticket: Ticket;
  isLoggedIn?: boolean;
  isOwner?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const tema = TEMA_LABELS[ticket.tema] ?? TEMA_LABELS.generico;
  const disponivel = ticket.status === "disponivel";
  const dataHora = ticket.utilizado_em ? formatarDataHora(ticket.utilizado_em) : null;

  function handleToggleStatus() {
    startTransition(async () => {
      try {
        if (disponivel) {
          await marcarComoUtilizado(ticket.id);
          toast.success("Ticket marcado como utilizado.");
        } else {
          await reativarTicket(ticket.id);
          toast.success("Ticket reativado.");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Algo deu errado.");
      }
    });
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[28px] bg-cream-100 shadow-soft border border-gold-500/30 overflow-hidden"
      >
        {!disponivel && <Stamp />}

        {/* Imagem de capa */}
        <div className="relative aspect-[16/10] bg-cream-300">
          {ticket.imagem ? (
            <Image src={ticket.imagem} alt={ticket.titulo} fill className="object-cover" unoptimized priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">{tema.emoji}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
        </div>

        <div className="p-7 sm:p-8">
          {/* Cabeçalho */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <Heart className="w-3.5 h-3.5 text-wine-500" fill="currentColor" />
            <span className="font-label text-[11px] tracking-[0.25em] uppercase gold-shimmer">
              Love Ticket
            </span>
            <Heart className="w-3.5 h-3.5 text-wine-500" fill="currentColor" />
          </div>

          {/* Título */}
          <h1 className="font-display text-3xl text-center text-ink leading-tight mb-2">
            {tema.emoji} {ticket.titulo}
          </h1>

          {disponivel && ticket.descricao && (
            <p className="text-center text-ink/60 font-body text-sm mb-6">{ticket.descricao}</p>
          )}

          {/* Divider */}
          <div className="divider-dashed w-full my-6" />

          {/* Número do ticket */}
          <p className="text-center font-label text-[10px] tracking-[0.2em] uppercase text-ink/40 mb-6">
            Ticket N.º {ticket.codigo}
          </p>

          {disponivel ? (
            <div className="text-center space-y-2">
              <p className="font-label text-[11px] tracking-[0.2em] uppercase text-ink/50">Status</p>
              <p className="font-label text-lg tracking-[0.1em] text-emerald-700">
                🟢 DISPONÍVEL
              </p>
              <p className="font-body text-sm text-ink/60 pt-1">
                Este presente ainda espera por você.
              </p>
              <p className="font-display text-base text-gold-600 pt-2">
                ✨ Aproveite esse momento especial.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="font-label text-lg tracking-[0.1em] text-wine-500">🔴 UTILIZADO</p>
              <p className="font-body text-sm text-ink/60">Este momento já foi vivido ❤️</p>
              {dataHora && (
                <div className="pt-2">
                  <p className="font-label text-[10px] tracking-[0.2em] uppercase text-ink/40">
                    Utilizado em
                  </p>
                  <p className="font-display text-base text-ink/70">
                    {dataHora.data} · {dataHora.hora}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {isOwner && (
          <div className="px-7 sm:px-8 pb-7 sm:pb-8 -mt-2">
            <div className="divider-dashed w-full mb-5 opacity-60" />
            <Button
              variant={disponivel ? "gold" : "outline"}
              className="w-full"
              onClick={handleToggleStatus}
              disabled={isPending}
            >
              {disponivel ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              {isPending
                ? "Atualizando..."
                : disponivel
                ? "Marcar como Utilizado"
                : "Reativar Ticket"}
            </Button>
            <p className="text-center text-[10px] font-body text-ink/35 mt-2">
              Visível só para você, o dono deste ticket.
            </p>
          </div>
        )}

        {!isLoggedIn && (
          <div className="px-7 sm:px-8 pb-6 sm:pb-7 -mt-2 flex justify-center">
            <Link
              href={`/login?redirectTo=/ticket/${ticket.codigo}`}
              className="inline-flex items-center gap-1.5 font-label text-[10px] tracking-[0.15em] uppercase text-ink/35 hover:text-wine-500 transition-colors"
            >
              <LogIn className="w-3 h-3" />
              Entrar como proprietário
            </Link>
          </div>
        )}

        <div className="ticket-notch divider-dashed w-full opacity-0" aria-hidden />
      </motion.div>

      <div className="flex justify-center mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-label text-xs tracking-[0.15em] uppercase text-wine-500 bg-cream-100/90 border border-gold-500/30 rounded-full px-5 py-2.5 shadow-soft hover:bg-cream-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </Link>
      </div>
    </div>
  );
}
