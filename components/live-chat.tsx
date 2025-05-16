"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageSquare, Maximize2, Minimize2 } from "lucide-react"
import { FloatingPlayer } from "@/components/floating-player"
import { createPortal } from "react-dom"

interface Message {
  id: string
  username: string
  text: string
  color: string
  timestamp: Date
}

// Colores de usuario al estilo Twitch
const userColors = [
  "#FF4A80",
  "#FF7070",
  "#FF8A5E",
  "#FFAA44",
  "#FFCC33",
  "#FFE500",
  "#C5E96C",
  "#00CC8F",
  "#00CCCC",
  "#00AAFF",
  "#0099FF",
  "#7B5AFF",
  "#CC66FF",
  "#FF66CC",
  "#FF6666",
]

export function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      username: "MaríaL",
      text: "¡Hola a todos! ¿Alguien más escuchando desde Madrid?",
      color: userColors[0],
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      username: "CarlosR",
      text: "¡Me encanta esta canción! 🎵",
      color: userColors[1],
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "3",
      username: "LauraS",
      text: "¿Alguien sabe el nombre del artista anterior?",
      color: userColors[2],
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: "4",
      username: "JavierM",
      text: "Era Alejandro Sanz, su nuevo single",
      color: userColors[3],
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
    {
      id: "5",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
    {
      id: "6",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
    {
      id: "7",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
    {
      id: "8",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
    {
      id: "9",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
    {
      id: "10",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
    {
      id: "11",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
      {
      id: "12",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
      {
      id: "13",
      username: "AnaSG",
      text: "Saludos desde Barcelona! 👋",
      color: userColors[4],
      timestamp: new Date(Date.now() - 1000 * 30),
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [username, setUsername] = useState("Usuario" + Math.floor(Math.random() * 1000))
  const [userColor] = useState(userColors[Math.floor(Math.random() * userColors.length)])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)
  const onlineUsers = messages.length + Math.floor(Math.random() * 15) + 10 // Simulación de usuarios en línea

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
    if (fullscreenContainerRef.current) {
      fullscreenContainerRef.current.scrollTop = fullscreenContainerRef.current.scrollHeight
    }
  }, [messages, isFullscreen])

  // Bloquear el scroll del body cuando está en pantalla completa
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreen])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: Date.now().toString(),
      username: username,
      text: newMessage,
      color: userColor,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const renderChatMessages = (ref: React.RefObject<HTMLDivElement>) => (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto p-2 space-y-1 text-sm bg-[#0e0e10]"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#333 #0e0e10" }}
    >
      {messages.map((message) => (
        <div key={message.id} className="leading-tight">
          <span className="text-gray-400 text-xs mr-1">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span style={{ color: message.color }} className="font-semibold">
            {message.username}:{" "}
          </span>
          <span className="text-gray-200">{message.text}</span>
        </div>
      ))}
    </div>
  )

  const renderChatInput = () => (
    <div className="p-2 border-t border-gray-800 bg-[#1f1f23]">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enviar un mensaje"
          className="bg-[#18181b] border-gray-700 text-white text-sm h-8 focus-visible:ring-[#03a9f4]"
        />
        <Button type="submit" size="sm" className="bg-[#03a9f4] hover:bg-[#0288d1] h-8 px-2">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )

  // Renderizar el chat normal
  const normalChat = (
    <div className="flex flex-col h-[400px] bg-[#18181b] rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-[#1f1f23] p-2 flex items-center">
        <MessageSquare className="h-4 w-4 mr-2 text-[#03a9f4]" />
        <h3 className="font-bold text-sm">CHAT EN VIVO</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="bg-[#03a9f4] text-white text-xs px-2 py-0.5 rounded-full">{onlineUsers} en línea</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-[#333]"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {renderChatMessages(chatContainerRef)}
      {renderChatInput()}
    </div>
  )

  // Renderizar el chat en pantalla completa
  const fullscreenChat = isFullscreen
    ? createPortal(
        <div className="fixed inset-0 z-50 bg-[#0e0e10] flex flex-col" style={{ 
          top: "69px",
          height: "calc(100vh - 69px)",
         }}>
          <div className={`bg-[#1f1f23] p-3 flex items-center`}>
            <MessageSquare className="h-5 w-5 mr-2 text-[#03a9f4]" />
            <h3 className="font-bold text-white">CHAT EN VIVO</h3>
            <div className="ml-auto flex items-center gap-3">
              <div className="bg-[#03a9f4] text-white text-xs px-2 py-1 rounded-full">{onlineUsers} en línea</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#333]"
              >
                <Minimize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mensajes del chat */}
          {renderChatMessages(fullscreenContainerRef)}

          {/* Input del chat */}
          <div className="p-3 border-t border-gray-800 bg-[#1f1f23]">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enviar un mensaje"
                className="bg-[#18181b] border-gray-700 text-white focus-visible:ring-[#03a9f4]"
              />
              <Button type="submit" className="bg-[#03a9f4] hover:bg-[#0288d1]">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <>
      {normalChat}
      {fullscreenChat}
    </>
  )
}
