import { en } from "./en"
import { fr } from "./fr"
import { rw } from "./rw"

export const dictionaries = {
  en,
  fr,
  rw,
}

export type Language = keyof typeof dictionaries

