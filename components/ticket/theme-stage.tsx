"use client";

import { motion } from "framer-motion";
import { TicketTema } from "@/lib/types";
import { TEMAS } from "@/lib/temas";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------- */
/* Cinema — luzes piscando, holofotes girando, poeira de projetor flutuando */
/* ---------------------------------------------------------------------- */
function CinemaAmbience() {
  const bulbs = Array.from({ length: 14 });
  const dust = Array.from({ length: 22 });

  return (
    <>
      {/* fileira de lâmpadas piscando */}
      <div className="absolute inset-x-0 top-0 flex justify-center gap-4 pt-8 opacity-70">
        {bulbs.map((_, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gold-300"
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.14 }}
          />
        ))}
      </div>

      {/* holofotes girando lentamente */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[140vw] h-[140vw] origin-top"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(228,200,116,0.10) 8deg, transparent 20deg, transparent 160deg, rgba(228,200,116,0.08) 172deg, transparent 184deg, transparent 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {/* glow central pulsando */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gold-300/10 blur-3xl"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* poeira flutuando, tipo feixe de projetor */}
      {dust.map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-[3px] h-[3px] rounded-full bg-cream-100/70"
          style={{ left: `${(i * 37) % 100}%`, top: `${10 + ((i * 53) % 80)}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Hambúrguer — forja: brasas subindo, calor tremeluzindo, brilho pulsando  */
/* ---------------------------------------------------------------------- */
function HamburgerAmbience() {
  const embers = Array.from({ length: 22 });
  const heat = Array.from({ length: 6 });

  return (
    <>
      <motion.div
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-orange-600/30 to-transparent"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* brasas subindo com leve zigue-zague */}
      {embers.map((_, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-orange-400"
          style={{
            left: `${(i * 43) % 100}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
          }}
          animate={{
            y: [0, -260 - (i % 5) * 30],
            x: [0, (i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 6), 0],
            opacity: [0.95, 0.9, 0],
          }}
          transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.35, ease: "easeOut" }}
        />
      ))}

      {/* tremulação de calor subindo, tipo distorção sutil */}
      {heat.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-24 h-72 bg-orange-500/5 blur-xl rounded-full"
          style={{ left: `${10 + i * 16}%` }}
          animate={{ y: [0, -40, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3.5 + (i % 3), repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Praia — céu mudando de cor, sol pulsando, ondas e nuvens se movendo      */
/* ---------------------------------------------------------------------- */
function PraiaAmbience() {
  const gaivotas = Array.from({ length: 2 });
  const brilhos = Array.from({ length: 10 });

  return (
    <>
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-[#FFE3B0] blur-2xl"
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* nuvens deslizando */}
      <motion.div
        className="absolute top-16 left-[-20%] w-40 h-10 rounded-full bg-white/40 blur-md"
        animate={{ x: ["0%", "260%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-28 left-[-30%] w-28 h-8 rounded-full bg-white/30 blur-md"
        animate={{ x: ["0%", "260%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear", delay: 4 }}
      />

      {/* gaivotas, formas simples em V se movendo */}
      {gaivotas.map((_, i) => (
        <motion.svg
          key={i}
          width="20"
          height="10"
          viewBox="0 0 20 10"
          className="absolute opacity-40"
          style={{ top: `${20 + i * 8}%` }}
          animate={{ x: ["-10%", "130%"] }}
          transition={{ duration: 18 + i * 5, repeat: Infinity, ease: "linear", delay: i * 3 }}
        >
          <path d="M0 8 Q5 0 10 8 Q15 0 20 8" stroke="#6E1423" strokeWidth="1.4" fill="none" />
        </motion.svg>
      ))}

      {/* brilhos na água */}
      {brilhos.map((_, i) => (
        <motion.span
          key={i}
          className="absolute bottom-8 w-1 h-1 rounded-full bg-white"
          style={{ left: `${(i * 31) % 100}%` }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* ondas */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 400 80" preserveAspectRatio="none">
        <motion.path
          fill="#ffffff"
          fillOpacity="0.35"
          animate={{
            d: [
              "M0,40 C100,60 300,20 400,40 L400,80 L0,80 Z",
              "M0,45 C120,25 280,55 400,35 L400,80 L0,80 Z",
              "M0,40 C100,60 300,20 400,40 L400,80 L0,80 Z",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          fill="#ffffff"
          fillOpacity="0.2"
          animate={{
            d: [
              "M0,55 C140,35 260,65 400,50 L400,80 L0,80 Z",
              "M0,50 C160,70 240,30 400,55 L400,80 L0,80 Z",
              "M0,55 C140,35 260,65 400,50 L400,80 L0,80 Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Jantar — luz de vela tremeluzindo, faíscas subindo, brilho dourado       */
/* ---------------------------------------------------------------------- */
function JantarAmbience() {
  const faiscas = Array.from({ length: 12 });

  return (
    <>
      <motion.div
        className="absolute left-1/2 top-16 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gold-300/15 blur-3xl"
        animate={{ opacity: [0.45, 0.95, 0.5, 0.85, 0.45], scale: [1, 1.05, 0.98, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* "chama" pequena e tremeluzente, sugerindo vela */}
      <motion.div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 w-3 h-6 rounded-full bg-gold-300/80 blur-[2px]"
        animate={{
          scaleY: [1, 1.25, 0.9, 1.15, 1],
          scaleX: [1, 0.9, 1.05, 0.95, 1],
          opacity: [0.8, 1, 0.7, 0.95, 0.8],
        }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* faíscas douradas subindo devagar */}
      {faiscas.map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold-300"
          style={{ left: `${30 + ((i * 17) % 40)}%`, top: "42%" }}
          animate={{ y: [0, -120 - (i % 4) * 20], opacity: [0, 0.9, 0], x: [0, (i % 2 ? 1 : -1) * 10] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Massagem — ondas concêntricas relaxantes + partículas flutuando devagar */
/* ---------------------------------------------------------------------- */
function MassagemAmbience() {
  const ripples = Array.from({ length: 3 });
  const petalas = Array.from({ length: 8 });

  return (
    <>
      {ripples.map((_, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border border-gold-500/20"
          style={{ width: 120, height: 120, marginLeft: -60, marginTop: -60 }}
          animate={{ scale: [1, 3.4], opacity: [0.55, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 1.6, ease: "easeOut" }}
        />
      ))}

      {/* pétalas / bolhas flutuando devagar, tipo aromaterapia */}
      {petalas.map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-500/25"
          style={{
            left: `${(i * 29) % 100}%`,
            bottom: "-5%",
            width: 6 + (i % 3) * 3,
            height: 6 + (i % 3) * 3,
          }}
          animate={{ y: ["0%", "-120vh"], x: [0, (i % 2 ? 1 : -1) * 30, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 14 + (i % 5) * 2, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Viagem — nuvens cruzando o céu, linha de embarque pontilhada, aviãozinho */
/* ---------------------------------------------------------------------- */
function ViagemAmbience() {
  const nuvens = Array.from({ length: 3 });

  return (
    <>
      <div className="absolute inset-x-0 top-10 flex justify-center opacity-50">
        <div className="w-[90%] max-w-md border-t-2 border-dashed border-wine-500/30" />
      </div>

      {nuvens.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/50 blur-sm"
          style={{
            top: `${15 + i * 18}%`,
            width: 70 + i * 20,
            height: 22 + i * 4,
            left: "-20%",
          }}
          animate={{ x: ["0%", "260%"] }}
          transition={{ duration: 22 + i * 8, repeat: Infinity, ease: "linear", delay: i * 3 }}
        />
      ))}

      {/* aviãozinho cruzando */}
      <motion.svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6E1423"
        strokeWidth="1.4"
        className="absolute opacity-40"
        style={{ top: "34%" }}
        animate={{ x: ["-10%", "130%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <path d="M2 16l7-2 4.5-8.5a1 1 0 011.8.9L13 14l7-1 2 2-8 3-2 5-2-1 1-4-6 2-2-2 4-2z" />
      </motion.svg>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Genérico — brilhos dourados + corações pequenos subindo devagar         */
/* ---------------------------------------------------------------------- */
function GenericoAmbience() {
  const sparkles = Array.from({ length: 12 });
  const coracoes = Array.from({ length: 5 });

  return (
    <>
      {sparkles.map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold-500"
          style={{ left: `${(i * 31) % 100}%`, top: `${(i * 47) % 100}%` }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {coracoes.map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-wine-500/20"
          style={{ left: `${10 + i * 20}%`, bottom: "-5%", fontSize: 12 + (i % 3) * 4 }}
          animate={{ y: ["0%", "-110vh"], opacity: [0, 0.5, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: 16 + i * 2, repeat: Infinity, delay: i * 2, ease: "easeInOut" }}
        >
          ❤
        </motion.span>
      ))}
    </>
  );
}

const AMBIENCE: Record<TicketTema, () => React.ReactElement> = {
  cinema: CinemaAmbience,
  hamburguer: HamburgerAmbience,
  praia: PraiaAmbience,
  jantar: JantarAmbience,
  massagem: MassagemAmbience,
  viagem: ViagemAmbience,
  generico: GenericoAmbience,
};

export function ThemeStage({
  tema,
  children,
}: {
  tema: TicketTema;
  children: React.ReactNode;
}) {
  const config = TEMAS[tema] ?? TEMAS.generico;
  const Ambience = AMBIENCE[tema] ?? AMBIENCE.generico;

  return (
    <main
      className={cn(
        "min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-16 bg-gradient-to-b",
        config.bgClass
      )}
    >
      {/* leve respiração de gradiente no fundo, pra nunca ficar 100% estático */}
      <motion.div
        className={cn("absolute inset-0 bg-gradient-to-br", config.bgClass)}
        animate={{ opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <Ambience />
      </div>
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </main>
  );
}
