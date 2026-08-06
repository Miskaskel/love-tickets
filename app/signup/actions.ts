"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function cadastrarUsuario(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const senha = String(formData.get("senha") || "");

  if (!nome) {
    throw new Error("Informe seu nome.");
  }
  if (!email || !senha) {
    throw new Error("Preencha e-mail e senha.");
  }
  if (senha.length < 6) {
    throw new Error("A senha precisa ter pelo menos 6 caracteres.");
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { full_name: nome } },
  });

  if (error) throw new Error(error.message);

  // Se a confirmação de e-mail estiver ativada no Supabase, o Supabase não
  // retorna uma sessão aqui — a pessoa precisa confirmar o e-mail antes de logar.
  const precisaConfirmarEmail = !data.session;

  return { precisaConfirmarEmail };
}
