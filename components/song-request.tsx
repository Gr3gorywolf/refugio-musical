"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Music, Send, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  cover: string
  year: string
  genre: string
}

export function SongRequest() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [message, setMessage] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const songsPerPage = 6

  // Lista de canciones de ejemplo
  const songs: Song[] = [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1975",
      genre: "Rock",
    },
    {
      id: "2",
      title: "Billie Jean",
      artist: "Michael Jackson",
      album: "Thriller",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1982",
      genre: "Pop",
    },
    {
      id: "3",
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1976",
      genre: "Rock",
    },
    {
      id: "4",
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1987",
      genre: "Rock",
    },
    {
      id: "5",
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1971",
      genre: "Rock",
    },
    {
      id: "6",
      title: "Like a Rolling Stone",
      artist: "Bob Dylan",
      album: "Highway 61 Revisited",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1965",
      genre: "Rock",
    },
    {
      id: "7",
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      album: "Nevermind",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1991",
      genre: "Grunge",
    },
    {
      id: "8",
      title: "Yesterday",
      artist: "The Beatles",
      album: "Help!",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1965",
      genre: "Pop",
    },
    {
      id: "9",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1971",
      genre: "Rock",
    },
    {
      id: "10",
      title: "Thriller",
      artist: "Michael Jackson",
      album: "Thriller",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1982",
      genre: "Pop",
    },
    {
      id: "11",
      title: "Wonderwall",
      artist: "Oasis",
      album: "(What's the Story) Morning Glory?",
      cover: "/placeholder.svg?height=80&width=80",
      year: "1995",
      genre: "Rock",
    },
    {
      id: "12",
      title: "Despacito",
      artist: "Luis Fonsi ft. Daddy Yankee",
      album: "Vida",
      cover: "/placeholder.svg?height=80&width=80",
      year: "2017",
      genre: "Reggaeton",
    },
    {
      id: "13",
      title: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷",
      cover: "/placeholder.svg?height=80&width=80",
      year: "2017",
      genre: "Pop",
    },
    {
      id: "14",
      title: "Rolling in the Deep",
      artist: "Adele",
      album: "21",
      cover: "/placeholder.svg?height=80&width=80",
      year: "2011",
      genre: "Pop",
    },
    {
      id: "15",
      title: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      album: "Uptown Special",
      cover: "/placeholder.svg?height=80&width=80",
      year: "2014",
      genre: "Funk",
    },
  ]

  const filteredSongs = searchQuery
    ? songs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : songs

  // Paginación
  const totalPages = Math.ceil(filteredSongs.length / songsPerPage)
  const indexOfLastSong = currentPage * songsPerPage
  const indexOfFirstSong = indexOfLastSong - songsPerPage
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song)
    setSearchQuery("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSong) return

    // Aquí iría la lógica para enviar la solicitud al backend
    console.log("Solicitud enviada:", { song: selectedSong, message })

    // Mostrar mensaje de éxito
    setShowSuccess(true)

    // Resetear el formulario después de 3 segundos
    setTimeout(() => {
      setSelectedSong(null)
      setMessage("")
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className="bg-[#333333] rounded-lg md:px-4 py-4 px-2 ">
      <div className="flex items-center gap-2 mb-4">
        <Music className="h-5 w-5 text-[#03a9f4]" />
        <h3 className="text-xl font-bold">Solicita tu Canción</h3>
      </div>
      <iframe src={`${process.env.NEXT_PUBLIC_AZURACAST_URL}/public/radio_cabral/embed-requests?theme=dark`} 
      frameBorder="0" 
      allowTransparency
      style={{ 
        backgroundColor: "transparent",
        border: "none",
        width: "100%",
        height: "850px",
       }}>
      </iframe>

    </div>
  )
}
