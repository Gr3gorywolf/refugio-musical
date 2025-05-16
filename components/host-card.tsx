import Image from "next/image"
import { Calendar } from "lucide-react"

interface Host {
  id: number
  name: string
  role: string
  image: string
  schedule: string
  bio: string
}

interface HostCardProps {
  host: Host
}

export function HostCard({ host }: HostCardProps) {
  return (
    <div className="bg-[#333333] rounded-lg overflow-hidden transition-transform hover:scale-[1.02] w-full md:w-1/2 lg:w-1/4">
      <div className="relative h-48">
        <Image src={host.image || "/placeholder.svg"} alt={host.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#333333] to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold">{host.name}</h3>
        <p className="text-[#03a9f4] text-sm mb-2">{host.role}</p>

        <div className="flex items-center text-gray-300 text-xs mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{host.schedule}</span>
        </div>

        <p className="text-gray-300 text-sm">{host.bio}</p>
      </div>
    </div>
  )
}
