"use server"

import { cookies } from "next/headers"

export async function checkAdminAuth(): Promise<boolean> {
  try {
    console.log("Starting checkAdminAuth function")
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get("admin_authenticated")
    console.log("Admin cookie found:", adminCookie ? "Yes" : "No")

    if (adminCookie) {
      console.log("Admin cookie value:", adminCookie.value)
    }

    const isAuthenticated = adminCookie?.value === "true"
    console.log("Is authenticated:", isAuthenticated)
    return isAuthenticated
  } catch (error) {
    console.error("Error in checkAdminAuth:", error)
    return false
  }
}
