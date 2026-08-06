import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Ticket } from "@/lib/types";
import { TicketDashboard } from "@/components/menu/ticket-dashboard";
import { CreateTicketButton } from "@/components/menu/create-ticket-button";
import { AccountMenu } from "@/components/menu/account-menu";
import { Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // O middleware já protege /menu, mas checamos de novo aqui por segurança —
  // sem usuário não tem como saber de quem são os tickets a mostrar.
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tickets = (data ?? []) as Ticket[];

  // Nome preenchido no cadastro (guardado nos metadados do usuário). Quem
  // criou conta antes dessa mudança não tem esse campo — usamos o e-mail
  // como reserva pra nunca ficar sem nada pra mostrar.
  const nome = (user.user_metadata?.full_name as string | undefined)?.trim();
  const nomeExibido = nome || user.email || "";

  return (
    <main className="min-h-screen bg-cream-200 paper-texture">
      <header className="border-b border-gold-500/20 bg-cream-100/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-wine-500" fill="currentColor" />
            <div>
              <h1 className="font-label text-sm tracking-[0.2em] uppercase text-wine-500">
                Love Tickets
              </h1>
              <p className="text-xs text-ink/50 font-body">Menu de {nomeExibido}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreateTicketButton />
            <AccountMenu nome={nomeExibido} email={user.email ?? ""} />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-700 text-sm p-4 mb-6 font-body">
            Erro ao carregar tickets: {error.message}. Confira suas variáveis de ambiente do
            Supabase.
          </div>
        )}

        <TicketDashboard tickets={tickets} />
      </div>
    </main>
  );
}
