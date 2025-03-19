"use client"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const t = dictionaries[language]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 px-0 transition-all duration-200 hover:scale-110">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t.language.select}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span className={language === "en" ? "font-bold" : ""}>{t.language.en}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("fr")}>
          <span className={language === "fr" ? "font-bold" : ""}>{t.language.fr}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("rw")}>
          <span className={language === "rw" ? "font-bold" : ""}>{t.language.rw}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

