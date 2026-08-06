"use client";

import { useMemo, useState } from "react";
import { Ticket } from "@/lib/types";
import { TicketGrid } from "@/components/menu/ticket-grid";
import { cn } from "@/lib/utils";

type Filtro = "todos" | "disponivel" | "utilizado";

export function TicketDashboard({ tickets }: { tickets: Ticket[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const contagem = useMemo(
    () => ({
      todos: tickets.length,
      disponivel: tickets.filter((t) => t.status === "disponivel").length,
      utilizado: tickets.filter((t) => t.status === "utilizado").length,
    }),
    [tickets]
  );

  const filtrados = useMemo(() => {
    if (filtro === "todos") return tickets;
    return tickets.filter((t) => t.status === filtro);
  }, [tickets, filtro]);

  const abas: { key: Filtro; label: string }[] = [
    { key: "todos", label: `Todos (${contagem.todos})` },
    { key: "disponivel", label: `Disponíveis (${contagem.disponivel})` },
    { key: "utilizado", label: `Utilizados (${contagem.utilizado})` },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-8">
        {abas.map((aba) => (
          <button
            key={aba.key}
            onClick={() => setFiltro(aba.key)}
            className={cn(
              "font-label text-[11px] tracking-[0.12em] uppercase px-4 py-2 rounded-full border transition-colors",
              filtro === aba.key
                ? "bg-wine-500 text-cream-100 border-wine-500"
                : "bg-cream-50 text-ink/60 border-ink/10 hover:border-wine-500/30"
            )}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl text-ink/50 mb-2">
            {filtro === "todos" ? "Nenhum ticket ainda" : "Nada por aqui"}
          </p>
          <p className="text-sm text-ink/40 font-body">
            {filtro === "todos"
              ? "Crie o primeiro ticket para gerar o QR Code e o link de presente."
              : "Nenhum ticket nesse status no momento."}
          </p>
        </div>
      ) : (
        <TicketGrid tickets={filtrados} />
      )}
    </div>
  );
}
