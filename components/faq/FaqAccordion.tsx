"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/content/faqData";

type Props = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full border border-border bg-background">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="border-b border-border last:border-b-0">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-bold uppercase tracking-wider text-foreground"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown className={["h-4 w-4 shrink-0 transition-transform", isOpen ? "rotate-180" : ""].join(" ")} />
            </button>
            {isOpen && <div className="px-4 pb-4 text-sm text-foreground/80">{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
