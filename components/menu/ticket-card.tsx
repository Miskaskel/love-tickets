"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Ticket, TEMA_LABELS } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TicketForm } from "@/components/menu/ticket-form";
import {
  editarTicket,
  excluirTicket,
  marcarComoUtilizado,
  reativarTicket,
} from "@/app/menu/actions";
import {
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  RotateCcw,
  QrCode,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  );
}

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const tema = TEMA_LABELS[ticket.tema] ?? TEMA_LABELS.generico;
  const disponivel = ticket.status === "disponivel";

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

  function handleDelete() {
    startTransition(async () => {
      try {
        await excluirTicket(ticket.id);
        toast.success("Ticket excluído.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Algo deu errado.");
      }
    });
  }

  async function handleDownloadQr() {
    try {
      const url = `${getSiteUrl()}/ticket/${ticket.codigo}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 800,
        margin: 2,
        color: { dark: "#6E1423", light: "#F8F2E4" },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `love-ticket-${ticket.codigo}.png`;
      a.click();
    } catch {
      toast.error("Não foi possível gerar o QR Code.");
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative aspect-[16/9] bg-cream-300">
        {ticket.imagem ? (
          <Image src={ticket.imagem} alt={ticket.titulo} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">{tema.emoji}</div>
        )}
        <Badge
          className={
            disponivel
              ? "absolute top-3 right-3 bg-emerald-600/90 text-cream-50 border-transparent"
              : "absolute top-3 right-3 bg-wine-500/90 text-cream-50 border-transparent"
          }
        >
          {disponivel ? "Disponível" : "Utilizado"}
        </Badge>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-label tracking-[0.15em] uppercase text-gold-600 mb-1">
              {tema.emoji} {tema.label} · #{ticket.codigo}
            </p>
            <h3 className="font-display text-xl text-ink leading-tight">{ticket.titulo}</h3>
            {ticket.descricao && (
              <p className="text-sm text-ink/60 font-body mt-1 line-clamp-2">{ticket.descricao}</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="w-4 h-4" />
                <span className="sr-only">Ações do ticket</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil className="w-3.5 h-3.5" />
                Editar Ticket
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDownloadQr}>
                <QrCode className="w-3.5 h-3.5" />
                Baixar QR Code
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleToggleStatus} disabled={isPending}>
                {disponivel ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                {disponivel ? "Marcar como Utilizado" : "Reativar Ticket"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => setDeleteOpen(true)}>
                <Trash2 className="w-3.5 h-3.5" />
                Excluir Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Diálogo de edição, controlado pelo item do menu */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ticket</DialogTitle>
            <DialogDescription>Atualize as informações do presente.</DialogDescription>
          </DialogHeader>
          <TicketForm
            ticket={ticket}
            action={(fd) => editarTicket(ticket.id, fd)}
            onDone={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão, controlada pelo item do menu */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Heart className="w-4 h-4" fill="currentColor" />
              Excluir ticket?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O ticket &ldquo;{ticket.titulo}&rdquo; será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
