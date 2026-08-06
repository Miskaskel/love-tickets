"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket, TEMA_LABELS, TicketTema } from "@/lib/types";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface TicketFormProps {
  ticket?: Ticket;
  action: (formData: FormData) => Promise<void>;
  onDone?: () => void;
}

export function TicketForm({ ticket, action, onDone }: TicketFormProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(ticket?.imagem ?? null);
  const [tema, setTema] = useState<TicketTema>(ticket?.tema ?? "generico");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(formData: FormData) {
    formData.set("tema", tema);
    startTransition(async () => {
      try {
        await action(formData);
        toast.success(ticket ? "Ticket atualizado." : "Ticket criado.");
        onDone?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Algo deu errado.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          name="titulo"
          placeholder="Ex: Cinema + Pipoca"
          defaultValue={ticket?.titulo}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          placeholder="Vale um encontro especial."
          defaultValue={ticket?.descricao ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tema">Tema da página</Label>
        <Select value={tema} onValueChange={(v) => setTema(v as TicketTema)}>
          <SelectTrigger id="tema">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TEMA_LABELS).map(([value, { label, emoji }]) => (
              <SelectItem key={value} value={value}>
                {emoji} {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-ink/40 font-body">
          Define o visual da página que a pessoa vê ao escanear o QR Code.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imagem">Imagem de capa</Label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-[16/9] rounded-xl border border-dashed border-gold-500/40 bg-cream-50 flex items-center justify-center overflow-hidden relative hover:border-gold-500 transition-colors"
        >
          {preview ? (
            <Image src={preview} alt="Pré-visualização" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink/40">
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs font-body">Clique para enviar uma imagem</span>
            </div>
          )}
        </button>
        <input
          ref={fileInputRef}
          id="imagem"
          name="imagem"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Salvando..." : ticket ? "Salvar alterações" : "Criar ticket"}
      </Button>
    </form>
  );
}
