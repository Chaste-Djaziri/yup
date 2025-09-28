"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

function VideoCard({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => setProgress((v.currentTime / (v.duration || 1)) * 100)
    v.addEventListener("timeupdate", onTime)
    return () => v.removeEventListener("timeupdate", onTime)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v) return
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    v.currentTime = pct * (v.duration || 0)
  }

  return (
    <div className="group">
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-sm bg-black">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          muted={muted}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            aria-label={playing ? "Pause" : "Play"}
            onClick={togglePlay}
            className="opacity-90 hover:opacity-100 transition rounded-full bg-white/90 p-3 shadow-md"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="flex items-center gap-2">
            <button
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={toggleMute}
              className="rounded-full bg-white/90 p-1.5 shadow"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <div className="flex-1 h-1.5 rounded bg-white/60 cursor-pointer" onClick={onSeek}>
              <div className="h-full rounded bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700 text-center">{title}</p>
    </div>
  )
}

export function VideosSection() {
  const videos = [
    { src: "/assets/videos/dumari.mp4", title: "Dumari" },
    { src: "/assets/videos/kshot.mp4", title: "Kshot" },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-gray-900">Stories in Motion</h2>
            <p className="max-w-[700px] text-gray-500 text-sm sm:text-base md:text-lg mx-auto">
              Short clips from our activities and community moments.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2">
          {videos.map((video, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <VideoCard src={video.src} title={video.title} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
