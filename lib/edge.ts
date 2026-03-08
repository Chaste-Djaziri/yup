import { supabase } from "@/lib/supabase";

export async function invokeFunction<TResponse = unknown, TBody = unknown>(name: string, body?: TBody): Promise<TResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Admin session missing or expired. Please log in again.");
  }

  const response = await fetch(`/api/functions/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body || {}),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data as TResponse;
}

export async function invokePublicFunction<TResponse = unknown, TBody = unknown>(name: string, body?: TBody): Promise<TResponse> {
  const response = await fetch(`/api/functions/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data as TResponse;
}
