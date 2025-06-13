"use client"

import { cookies } from "next/headers"

// This is a simple client-side authentication mechanism
// For production, you would want a more secure solution

const AUTH_KEY = "yup_admin_auth"
const SECRET_PASSWORD = "YupAdmin2024!" // Change this to your desired password

export function authenticateAdmin(password: string): boolean {
  if (password === SECRET_PASSWORD) {
    // Store authentication in localStorage
    localStorage.setItem(AUTH_KEY, "authenticated")
    return true
  }
  return false
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_KEY) === "authenticated"
}

export function logoutAdmin(): void {
  localStorage.removeItem(AUTH_KEY)
}
