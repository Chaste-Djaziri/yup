"use client"

import { useEffect, useRef } from "react"

export function ContactMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a real application, you would use a library like Google Maps, Mapbox, or Leaflet
    if (mapRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = mapRef.current.clientWidth
      canvas.height = mapRef.current.clientHeight
      mapRef.current.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Draw a simple placeholder map
        ctx.fillStyle = "#e2e2e2"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw some roads
        ctx.strokeStyle = "#f8f8f8"
        ctx.lineWidth = 3

        // Horizontal roads
        for (let i = 1; i < 5; i++) {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height * (i / 5))
          ctx.lineTo(canvas.width, canvas.height * (i / 5))
          ctx.stroke()
        }

        // Vertical roads
        for (let i = 1; i < 5; i++) {
          ctx.beginPath()
          ctx.moveTo(canvas.width * (i / 5), 0)
          ctx.lineTo(canvas.width * (i / 5), canvas.height)
          ctx.stroke()
        }

        // Draw a marker for the office location
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Pin base
        ctx.fillStyle = "#1f1f1f"
        ctx.beginPath()
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
        ctx.fill()

        // Pin dot
        ctx.fillStyle = "#f5f5f5"
        ctx.beginPath()
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
        ctx.fill()

        // Add "Map placeholder" text
        ctx.fillStyle = "#555555"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Interactive Map", centerX, canvas.height - 20)
      }

      return () => {
        if (mapRef.current && canvas.parentNode === mapRef.current) {
          mapRef.current.removeChild(canvas)
        }
      }
    }
  }, [])

  return <div ref={mapRef} className="w-full h-full bg-gray-100 rounded-lg"></div>
}
