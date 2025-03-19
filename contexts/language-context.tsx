"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Language } from "@/dictionaries"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      // Load saved language preference from localStorage
      const savedLanguage = localStorage.getItem("language") as Language

      if (savedLanguage && ["en", "fr", "rw"].includes(savedLanguage)) {
        setLanguage(savedLanguage)
      } else {
        // Detect browser/device language
        const browserLanguages = navigator.languages || [navigator.language]

        // Check if any of the browser's preferred languages match our supported languages
        for (const browserLang of browserLanguages) {
          const langCode = browserLang.split("-")[0].toLowerCase()

          if (langCode === "fr") {
            setLanguage("fr")
            break
          } else if (langCode === "rw") {
            setLanguage("rw")
            break
          }
        }
        // Default to English if no match found
      }
    } catch (error) {
      console.warn("Error detecting language:", error)
      // Default to English in case of any errors
      setLanguage("en")
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    // Save language preference to localStorage when it changes
    if (isLoaded) {
      try {
        localStorage.setItem("language", language)

        // Update the html lang attribute for accessibility and SEO
        document.documentElement.lang = language
      } catch (error) {
        console.warn("Error saving language preference:", error)
      }
    }
  }, [language, isLoaded])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

