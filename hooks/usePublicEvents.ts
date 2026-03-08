"use client";

import { useEffect, useState } from "react";
import type { DbEvent } from "@/types/backend";

export function usePublicEvents() {
  const [data, setData] = useState<DbEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/functions/admin-events-list", { method: "GET" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load events");
        return json.events as DbEvent[];
      })
      .then((events) => {
        if (!active) return;
        setData(events || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err : new Error("Failed to load events"));
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, error };
}

export function usePublicEventBySlug(slug?: string) {
  const { data, isLoading, error } = usePublicEvents();
  const event = slug ? data.find((item) => item.slug === slug) || null : null;
  return { data: event, isLoading, error };
}
