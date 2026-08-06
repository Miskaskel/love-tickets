import { Ticket } from "@/lib/types";
import { TicketCard } from "@/components/menu/ticket-card";

export function TicketGrid({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
