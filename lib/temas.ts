import { TicketTema } from "@/lib/types";

export interface TemaConfig {
  label: string;
  emoji: string;
  // classes de fundo da "cena" por trás do ticket
  bgClass: string;
  // cor de destaque (usada em pequenos detalhes, brilhos etc.)
  accent: string;
  // frase de ambientação exibida sutilmente no fundo
  ambienteLabel: string;
}

export const TEMAS: Record<TicketTema, TemaConfig> = {
  generico: {
    label: "Love Ticket",
    emoji: "💌",
    bgClass: "from-cream-300 via-cream-200 to-cream-300",
    accent: "#B8912F",
    ambienteLabel: "um presente especial",
  },
  cinema: {
    label: "Cinema",
    emoji: "🎬",
    bgClass: "from-[#0B0B12] via-[#15121F] to-[#0B0B12]",
    accent: "#E4C874",
    ambienteLabel: "sessão especial",
  },
  hamburguer: {
    label: "Hambúrguer",
    emoji: "🍔",
    bgClass: "from-[#1A0E08] via-[#2A150A] to-[#160B05]",
    accent: "#E28B3E",
    ambienteLabel: "forjado com amor",
  },
  praia: {
    label: "Praia",
    emoji: "🌅",
    bgClass: "from-[#FCE3C0] via-[#F6B99B] to-[#E97C6B]",
    accent: "#B8912F",
    ambienteLabel: "pôr do sol reservado",
  },
  jantar: {
    label: "Jantar",
    emoji: "🍷",
    bgClass: "from-[#1A0A0D] via-[#2A0F14] to-[#150609]",
    accent: "#E4C874",
    ambienteLabel: "mesa para dois",
  },
  massagem: {
    label: "Massagem",
    emoji: "💆",
    bgClass: "from-[#E9E3F5] via-[#DCE7EA] to-[#E3EDE9]",
    accent: "#8C6D1F",
    ambienteLabel: "momento de relaxar",
  },
  viagem: {
    label: "Viagem",
    emoji: "✈️",
    bgClass: "from-[#EAF2F4] via-[#DCEAEF] to-[#EAF2F4]",
    accent: "#6E1423",
    ambienteLabel: "embarque autorizado",
  },
};
