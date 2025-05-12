"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Music, History, Calendar } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

interface Song {
  id: string
  title: string
  artist: string
  cover: string
  time: string // Formato "HH:MM"
}

export function SongHistoryUpcoming() {
  const [currentTime, setCurrentTime] = useState<string>("")

  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 60000)

    return () => clearInterval(interval)
  }, [])

  // Generar horas pasadas para el historial
  const generatePastTimes = (count: number): string[] => {
    const times: string[] = []
    const now = new Date()

    for (let i = 1; i <= count; i++) {
      const pastTime = new Date(now.getTime() - i * 4 * 60000) // Cada 4 minutos en el pasado
      const hours = pastTime.getHours().toString().padStart(2, "0")
      const minutes = pastTime.getMinutes().toString().padStart(2, "0")
      times.push(`${hours}:${minutes}`)
    }

    return times
  }

  // Generar horas futuras para las próximas canciones
  const generateFutureTimes = (count: number): string[] => {
    const times: string[] = []
    const now = new Date()

    for (let i = 1; i <= count; i++) {
      const futureTime = new Date(now.getTime() + i * 4 * 60000) // Cada 4 minutos en el futuro
      const hours = futureTime.getHours().toString().padStart(2, "0")
      const minutes = futureTime.getMinutes().toString().padStart(2, "0")
      times.push(`${hours}:${minutes}`)
    }

    return times
  }

  const pastTimes = generatePastTimes(10)
  const futureTimes = generateFutureTimes(10)

  // Datos de ejemplo para el historial de canciones
  const historyData: Song[] = [
    {
      id: "h1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[0],
    },
    {
      id: "h2",
      title: "Hotel California",
      artist: "Eagles",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[1],
    },
    {
      id: "h3",
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[2],
    },
    {
      id: "h4",
      title: "Billie Jean",
      artist: "Michael Jackson",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[3],
    },
    {
      id: "h5",
      title: "Imagine",
      artist: "John Lennon",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[4],
    },
    {
      id: "h6",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[5],
    },
    {
      id: "h7",
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[6],
    },
    {
      id: "h8",
      title: "Yesterday",
      artist: "The Beatles",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[7],
    },
    {
      id: "h9",
      title: "Like a Rolling Stone",
      artist: "Bob Dylan",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[8],
    },
    {
      id: "h10",
      title: "Thriller",
      artist: "Michael Jackson",
      cover: "/placeholder.svg?height=60&width=60",
      time: pastTimes[9],
    },
  ]

  // Datos de ejemplo para las próximas canciones
  const upcomingData: Song[] = [
    {
      id: "u1",
      title: "Shape of You",
      artist: "Ed Sheeran",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[0],
    },
    {
      id: "u2",
      title: "Despacito",
      artist: "Luis Fonsi ft. Daddy Yankee",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[1],
    },
    {
      id: "u3",
      title: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[2],
    },
    {
      id: "u4",
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[3],
    },
    {
      id: "u5",
      title: "Dance Monkey",
      artist: "Tones and I",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[4],
    },
    {
      id: "u6",
      title: "Bad Guy",
      artist: "Billie Eilish",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[5],
    },
    {
      id: "u7",
      title: "Someone You Loved",
      artist: "Lewis Capaldi",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[6],
    },
    {
      id: "u8",
      title: "Señorita",
      artist: "Shawn Mendes & Camila Cabello",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[7],
    },
    {
      id: "u9",
      title: "Havana",
      artist: "Camila Cabello ft. Young Thug",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[8],
    },
    {
      id: "u10",
      title: "Don't Start Now",
      artist: "Dua Lipa",
      cover: "/placeholder.svg?height=60&width=60",
      time: futureTimes[9],
    },
  ]

  // Renderizar una canción
  const renderSong = (song: Song, isHistory: boolean) => (
    <div
      key={song.id}
      className="flex items-center gap-3 p-3 border-b border-gray-700 hover:bg-[#2a2a2a] transition-colors"
    >
      <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
        <Image src={song.cover || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{song.title}</h4>
        <p className="text-xs text-gray-300 truncate">{song.artist}</p>
      </div>

      <div className="flex items-center gap-1 text-xs text-[#03a9f4]">
        {isHistory ? (
          <>
            <History className="h-3 w-3" />
            <span>{song.time}</span>
          </>
        ) : (
          <>
            <Calendar className="h-3 w-3" />
            <span>{song.time}</span>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="bg-[#333333] rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-gray-700">
        <Music className="h-5 w-5 text-[#03a9f4]" />
        <h3 className="text-xl font-bold">Canciones</h3>
        <div className="ml-auto flex items-center gap-1 text-xs bg-[#424242] px-2 py-1 rounded-full">
          <Clock className="h-3 w-3 text-[#03a9f4]" />
          <span>Ahora: {currentTime}</span>
        </div>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid grid-cols-2 p-0 bg-[#2a2a2a]">
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-[#03a9f4] data-[state=active]:text-white rounded-none py-3"
          >
            <History className="h-4 w-4 mr-2" />
            Historial
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-[#03a9f4] data-[state=active]:text-white rounded-none py-3"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Próximas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="m-0 max-h-[400px] overflow-y-auto">
          <div className="divide-y divide-gray-700">{historyData.map((song) => renderSong(song, true))}</div>
        </TabsContent>

        <TabsContent value="upcoming" className="m-0 max-h-[400px] overflow-y-auto">
          <div className="divide-y divide-gray-700">{upcomingData.map((song) => renderSong(song, false))}</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
