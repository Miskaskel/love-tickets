import { customAlphabet } from "nanoid";

// Alfabeto sem caracteres ambíguos (sem 0/O, 1/I, etc.) — melhor pra imprimir.
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nanoid = customAlphabet(alphabet, 8);

export function gerarCodigo() {
  return nanoid();
}
