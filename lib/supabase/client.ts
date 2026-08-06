"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente usado em Client Components (formulário de login, botão de logout).
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
