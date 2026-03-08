"use client"

import { ReactNode } from "react"

type Goal = { n: number; label: string; color: string; icon: ReactNode }

const goals: Goal[] = [
  { n: 1, label: "No Poverty", color: "#111111", icon: "👨‍👩‍👧‍👦" },
  { n: 2, label: "Zero Hunger", color: "#1c1c1c", icon: "🍚" },
  { n: 3, label: "Good Health", color: "#272727", icon: "📈" },
  { n: 4, label: "Quality Education", color: "#323232", icon: "📖" },
  { n: 5, label: "Gender Equality", color: "#3d3d3d", icon: "⚖️" },
  { n: 6, label: "Clean Water", color: "#484848", icon: "💧" },
  { n: 7, label: "Affordable Energy", color: "#535353", icon: "🔆" },
  { n: 8, label: "Decent Work", color: "#5e5e5e", icon: "🛠️" },
  { n: 9, label: "Industry & Innovation", color: "#696969", icon: "🧱" },
  { n: 10, label: "Reduced Inequalities", color: "#747474", icon: "∷" },
  { n: 11, label: "Sustainable Cities", color: "#7f7f7f", icon: "🏙️" },
  { n: 12, label: "Responsible Consumption", color: "#8a8a8a", icon: "♻️" },
  { n: 13, label: "Climate Action", color: "#959595", icon: "🌍" },
  { n: 14, label: "Life Below Water", color: "#a0a0a0", icon: "🐟" },
  { n: 15, label: "Life on Land", color: "#ababab", icon: "🌳" },
  { n: 16, label: "Peace & Justice", color: "#b6b6b6", icon: "🕊️" },
  { n: 17, label: "Partnerships", color: "#c1c1c1", icon: "🔗" },
]

export function SDGBanner() {
  return (
    <section className="w-full py-10 bg-white">
      <div className="container px-4 md:px-6">
        <h3 className="text-center text-2xl md:text-3xl font-bold mb-8 text-gray-900">
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
