"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TicketForm } from "@/components/menu/ticket-form";
import { criarTicket } from "@/app/menu/actions";

export function CreateTicketButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-3.5 h-3.5" />
          Criar Ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Love Ticket</DialogTitle>
          <DialogDescription>
            Preencha os dados do presente. Código, QR Code e link são gerados automaticamente.
          </DialogDescription>
        </DialogHeader>
        <TicketForm action={criarTicket} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
