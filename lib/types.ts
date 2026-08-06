export type TicketStatus = "disponivel" | "utilizado";

export type TicketTema =
  | "generico"
  | "cinema"
  | "hamburguer"
  | "praia"
  | "jantar"
  | "massagem"
  | "viagem";

export interface Ticket {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
  tema: TicketTema;
  status: TicketStatus;
  utilizado_em: string | null;
  created_at: string;
  user_id: string;
}

export interface TicketInput {
  titulo: string;
  descricao: string;
  tema: TicketTema;
  imagem?: File | null;
}

export const TEMA_LABELS: Record<TicketTema, { label: string; emoji: string }> = {
  generico: { label: "Genérico", emoji: "💌" },
  cinema: { label: "Cinema", emoji: "🎬" },
  hamburguer: { label: "Hambúrguer", emoji: "🍔" },
  praia: { label: "Praia", emoji: "🌅" },
  jantar: { label: "Jantar", emoji: "🍷" },
  massagem: { label: "Massagem", emoji: "💆" },
  viagem: { label: "Viagem", emoji: "✈️" },
};
