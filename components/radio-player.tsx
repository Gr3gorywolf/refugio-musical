"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react"

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [currentTrack, setCurrentTrack] = useState({
    title: "Música Actual",
    artist: "Artista Popular",
    show: "Programa Matutino",
  })
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("https://example.com/stream") // Replace with your AzuraCast stream URL
    audioRef.current.volume = volume / 100

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />
    if (volume < 50) return <Volume1 className="h-5 w-5" />
    return <Volume2 className="h-5 w-5" />
  }

  // Simulate track updates (in a real app, this would come from the AzuraCast API)
  useEffect(() => {
    const interval = setInterval(() => {
      // This would be replaced with actual API calls to AzuraCast
      const tracks = [
        { title: "Canción Popular", artist: "Artista Famoso", show: "Programa Matutino" },
        { title: "Éxito del Momento", artist: "Grupo Musical", show: "Música Sin Parar" },
        { title: "Clásico Renovado", artist: "Cantante Legendario", show: "Clásicos del Ayer" },
      ]

      if (isPlaying) {
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)]
        setCurrentTrack(randomTrack)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="flex flex-col">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#03a9f4]">EN VIVO</h3>
        <div className="mt-4 space-y-1">
          <p className="text-lg font-medium">{currentTrack.title}</p>
          <p className="text-sm text-gray-300">{currentTrack.artist}</p>
          <p className="text-xs text-[#03a9f4]">{currentTrack.show}</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#2c2c2c] p-4 rounded-lg">
        <Button
          onClick={togglePlayPause}
          className="bg-[#03a9f4] hover:bg-[#0288d1] h-12 w-12 rounded-full"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>

        <div className="flex items-center gap-2 flex-1 max-w-[200px] ml-4">
          <span className="text-[#03a9f4]">{getVolumeIcon()}</span>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-full"
            aria-label="Volumen"
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Powered by <span className="text-[#03a9f4]">AzuraCast</span>
        </p>
      </div>
    </div>
  )
}
