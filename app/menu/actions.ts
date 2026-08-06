"use server";

import { createServerClient } from "@/lib/supabase/server";
import { gerarCodigo } from "@/lib/codigo";
import { revalidatePath } from "next/cache";
import { TicketTema } from "@/lib/types";

// Garante que só um usuário autenticado consegue executar qualquer uma dessas
// ações — mesmo que alguém tente chamar a server action diretamente, sem
// passar pela UI do dashboard. Retorna o usuário pra usarmos o user_id dele.
async function exigirUsuarioAutenticado() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado. Faça login para gerenciar os tickets.");

  return { supabase, user };
}

// Depois de um update/delete, confere se alguma linha foi realmente afetada.
// Se o Row Level Security bloquear (ticket de outro usuário), o Supabase não
// retorna erro — só devolve 0 linhas. Sem essa checagem o app ficaria em
// silêncio quando alguém tentasse mexer num ticket que não é dele.
function exigirLinhaAfetada<T>(data: T[] | null, mensagem: string) {
  if (!data || data.length === 0) {
    throw new Error(mensagem);
  }
}

async function uploadImagemSeExistir(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  imagem: File | null
) {
  if (!imagem || imagem.size === 0) return null;

  const extensao = imagem.name.split(".").pop() || "jpg";
  const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from("tickets")
    .upload(nomeArquivo, imagem, { contentType: imagem.type, upsert: false });

  if (error) throw new Error(`Falha ao enviar imagem: ${error.message}`);

  const { data } = supabase.storage.from("tickets").getPublicUrl(nomeArquivo);
  return data.publicUrl;
}

export async function criarTicket(formData: FormData) {
  const { supabase, user } = await exigirUsuarioAutenticado();

  const titulo = String(formData.get("titulo") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const tema = String(formData.get("tema") || "generico") as TicketTema;
  const imagem = formData.get("imagem") as File | null;

  if (!titulo) throw new Error("O título é obrigatório.");

  const imagemUrl = await uploadImagemSeExistir(supabase, imagem);

  // Garante código único (tentativa simples com retry)
  let codigo = gerarCodigo();
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const { data } = await supabase.from("tickets").select("id").eq("codigo", codigo).maybeSingle();
    if (!data) break;
    codigo = gerarCodigo();
  }

  const { error } = await supabase.from("tickets").insert({
    codigo,
    titulo,
    descricao,
    tema,
    imagem: imagemUrl,
    status: "disponivel",
    user_id: user.id,
  });

  if (error) throw new Error(`Falha ao criar ticket: ${error.message}`);

  revalidatePath("/menu");
}

export async function editarTicket(id: string, formData: FormData) {
  const { supabase, user } = await exigirUsuarioAutenticado();

  const titulo = String(formData.get("titulo") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const tema = String(formData.get("tema") || "generico") as TicketTema;
  const imagem = formData.get("imagem") as File | null;

  if (!titulo) throw new Error("O título é obrigatório.");

  const updates: Record<string, unknown> = { titulo, descricao, tema };

  const novaImagemUrl = await uploadImagemSeExistir(supabase, imagem);
  if (novaImagemUrl) updates.imagem = novaImagemUrl;

  const { data, error } = await supabase
    .from("tickets")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) throw new Error(`Falha ao editar ticket: ${error.message}`);
  exigirLinhaAfetada(data, "Você não tem permissão para editar este ticket.");

  revalidatePath("/menu");
}

export async function excluirTicket(id: string) {
  const { supabase, user } = await exigirUsuarioAutenticado();

  const { data, error } = await supabase
    .from("tickets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) throw new Error(`Falha ao excluir ticket: ${error.message}`);
  exigirLinhaAfetada(data, "Você não tem permissão para excluir este ticket.");

  revalidatePath("/menu");
}

export async function marcarComoUtilizado(id: string) {
  const { supabase, user } = await exigirUsuarioAutenticado();

  const { data, error } = await supabase
    .from("tickets")
    .update({ status: "utilizado", utilizado_em: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) throw new Error(`Falha ao marcar como utilizado: ${error.message}`);
  exigirLinhaAfetada(data, "Só o dono do ticket pode marcá-lo como utilizado.");

  revalidatePath("/menu");
  revalidatePath("/ticket/[codigo]", "page");
}

export async function reativarTicket(id: string) {
  const { supabase, user } = await exigirUsuarioAutenticado();

  const { data, error } = await supabase
    .from("tickets")
    .update({ status: "disponivel", utilizado_em: null })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) throw new Error(`Falha ao reativar ticket: ${error.message}`);
  exigirLinhaAfetada(data, "Só o dono do ticket pode reativá-lo.");

  revalidatePath("/menu");
  revalidatePath("/ticket/[codigo]", "page");
}
