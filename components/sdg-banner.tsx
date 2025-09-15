"use client"

import { ReactNode } from "react"

type Goal = { n: number; label: string; color: string; icon: ReactNode }

const goals: Goal[] = [
  { n: 1, label: "No Poverty", color: "#e5243b", icon: "👨‍👩‍👧‍👦" },
  { n: 2, label: "Zero Hunger", color: "#dda63a", icon: "🍚" },
  { n: 3, label: "Good Health", color: "#4c9f38", icon: "📈" },
  { n: 4, label: "Quality Education", color: "#c5192d", icon: "📖" },
  { n: 5, label: "Gender Equality", color: "#ff3a21", icon: "⚖️" },
  { n: 6, label: "Clean Water", color: "#26bde2", icon: "💧" },
  { n: 7, label: "Affordable Energy", color: "#fcc30b", icon: "🔆" },
  { n: 8, label: "Decent Work", color: "#a21942", icon: "🛠️" },
  { n: 9, label: "Industry & Innovation", color: "#fd6925", icon: "🧱" },
  { n: 10, label: "Reduced Inequalities", color: "#dd1367", icon: "∷" },
  { n: 11, label: "Sustainable Cities", color: "#fd9d24", icon: "🏙️" },
  { n: 12, label: "Responsible Consumption", color: "#bf8b2e", icon: "♻️" },
  { n: 13, label: "Climate Action", color: "#3f7e44", icon: "🌍" },
  { n: 14, label: "Life Below Water", color: "#0a97d9", icon: "🐟" },
  { n: 15, label: "Life on Land", color: "#56c02b", icon: "🌳" },
  { n: 16, label: "Peace & Justice", color: "#00689d", icon: "🕊️" },
  { n: 17, label: "Partnerships", color: "#19486a", icon: "🔗" },
]

export function SDGBanner() {
  return (
    <section className="w-full py-10 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <h3 className="text-center text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          SUSTAINABLE DEVELOPMENT GOALS
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-4 place-items-center">
          {goals.map((g) => (
            <div
              key={g.n}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl p-2 text-white flex flex-col justify-between shadow-sm"
              style={{ backgroundColor: g.color }}
            >
              <div className="flex items-start justify-between">
                <span className="text-lg sm:text-xl md:text-2xl font-extrabold leading-none">{g.n}</span>
              </div>
              <div className="flex flex-col items-center justify-center -mt-2">
                <div className="text-xl sm:text-2xl md:text-3xl" aria-hidden>
                  {g.icon as any}
                </div>
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-xs leading-tight text-center font-medium">
                {g.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
