import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente usado em Server Components / Server Actions / Route Handlers.
// Lê e escreve a sessão do usuário a partir dos cookies da requisição, então
// o Supabase sabe se quem está chamando está autenticado (ou não).
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // "setAll" chamado de um Server Component sem permissão de escrita
          // (ex: durante renderização estática). O middleware cuida do refresh
          // de sessão nesses casos, então é seguro ignorar aqui.
        }
      },
    },
  });
}
