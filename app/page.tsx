import Link from "next/link";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream-200 paper-texture px-6 text-center">
      <Heart className="w-10 h-10 text-wine-500 mb-4" fill="currentColor" />
      <h1 className="font-label text-2xl tracking-[0.2em] text-wine-500 uppercase mb-2">
        Love Tickets
      </h1>
      <p className="font-display text-lg text-ink/70 mb-8 max-w-sm">
        Sistema de controle de tickets de presentes românticos.
      </p>
      <Link
        href="/menu"
        className="font-label text-sm tracking-[0.15em] uppercase bg-wine-500 text-cream-100 px-8 py-3 rounded-full shadow-soft hover:bg-wine-600 transition-colors"
      >
        Ir para o Menu
      </Link>
    </main>
  );
}
