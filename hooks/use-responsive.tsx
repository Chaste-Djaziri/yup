"use client"

import { useState, useEffect } from "react"

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs")
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Function to update breakpoint based on window width
    const updateBreakpoint = () => {
      const windowWidth = window.innerWidth
      setWidth(windowWidth)

      if (windowWidth >= breakpoints["2xl"]) {
        setBreakpoint("2xl")
      } else if (windowWidth >= breakpoints.xl) {
        setBreakpoint("xl")
      } else if (windowWidth >= breakpoints.lg) {
        setBreakpoint("lg")
      } else if (windowWidth >= breakpoints.md) {
        setBreakpoint("md")
      } else if (windowWidth >= breakpoints.sm) {
        setBreakpoint("sm")
      } else {
        setBreakpoint("xs")
      }
    }

    // Set initial breakpoint
    updateBreakpoint()

    // Add event listener for window resize
    window.addEventListener("resize", updateBreakpoint)

    // Clean up event listener
    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [])

  // Helper functions to check current breakpoint
  const isXs = breakpoint === "xs"
  const isSm = breakpoint === "sm"
  const isMd = breakpoint === "md"
  const isLg = breakpoint === "lg"
  const isXl = breakpoint === "xl"
  const is2Xl = breakpoint === "2xl"

  // Helper functions to check if current width is at least a certain breakpoint
  const isSmUp = width >= breakpoints.sm
  const isMdUp = width >= breakpoints.md
  const isLgUp = width >= breakpoints.lg
  const isXlUp = width >= breakpoints.xl
  const is2XlUp = width >= breakpoints["2xl"]

  return {
    breakpoint,
    width,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isSmUp,
    isMdUp,
    isLgUp,
    isXlUp,
    is2XlUp,
  }
}

