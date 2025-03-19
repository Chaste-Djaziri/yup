import { dictionaries } from "@/dictionaries"
import type { Language } from "@/dictionaries"

/**
 * Safely access nested properties in translation dictionaries
 * @param language Current language
 * @param path Dot notation path to the translation (e.g., 'donate.form.title')
 * @param fallback Fallback text if translation is not found
 */
export function getTranslation(language: Language, path: string, fallback = ""): string {
  try {
    const keys = path.split(".")
    let result: any = dictionaries[language]

    for (const key of keys) {
      if (result === undefined || result === null) {
        return fallback
      }
      result = result[key]
    }

    return result !== undefined && result !== null ? result : fallback
  } catch (error) {
    console.warn(`Translation not found for path: ${path}`, error)
    return fallback
  }
}

/**
 * Safely access an array of translations
 * @param language Current language
 * @param path Dot notation path to the translation array
 * @param fallback Fallback array if translation is not found
 */
export function getTranslationArray<T>(language: Language, path: string, fallback: T[]): T[] {
  try {
    const keys = path.split(".")
    let result: any = dictionaries[language]

    for (const key of keys) {
      if (result === undefined || result === null) {
        return fallback
      }
      result = result[key]
    }

    return Array.isArray(result) ? result : fallback
  } catch (error) {
    console.warn(`Translation array not found for path: ${path}`, error)
    return fallback
  }
}

