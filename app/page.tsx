import { HostCard } from "@/components/host-card";
import { Button } from "@/components/ui/button";
import { Radio, Calendar, Headphones, Info, Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LiveChat } from "@/components/live-chat";
import { FloatingPlayer } from "@/components/floating-player";
import { ProgramSchedule } from "@/components/program-schedule";
import { SongRequest } from "@/components/song-request";
import { SongHistoryUpcoming } from "@/components/song-history-upcoming";

export default function Home() {
    const hosts = [
        {
            id: 1,
            name: "Jose Cabral",
            role: "Locutor matutino",
            image: "/jose-cabral.jpg?height=200&width=200",
            schedule: "Lunes a Viernes, 6:00 - 10:00",
            bio: "Con más de 10 años de experiencia en radio, Jose trae energía y buena musica cada dia",
        },
    ];

    const handleScrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-[#424242] text-white">
            {/* Floating Player */}
            <FloatingPlayer />

            {/* Header - Adjusted to account for floating player */}
            <header className="block z-10 mt-[69px] bg-[#424242] border-b border-[#03a9f4]/20">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo-circular.png?height=38&width=38"
                            alt="Radio cabral logo"
                            width={38}
                            height={38}
                            className="object-cover"
                        />
                        <span className="text-xl font-bold">Radio Cabral</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#" className="hover:text-[#03a9f4] transition-colors">
                            Inicio
                        </Link>
                        <Link href="#request" className="hover:text-[#03a9f4] transition-colors">
                            Solicita tu Canción
                        </Link>
                        <Link href="#songs" className="hover:text-[#03a9f4] transition-colors">
                            Canciones
                        </Link>
                        <Link href="#schedule" className="hover:text-[#03a9f4] transition-colors">
                            Programación
                        </Link>
                        <Link href="#hosts" className="hover:text-[#03a9f4] transition-colors">
                            Locutores
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section - Adjusted for floating player */}
            <section className="relative pt-8 pb-8 md:pt-32 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <Image
                        src="/placeholder.svg?height=600&width=1200"
                        alt="Radio background"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-1">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Tu <span className="text-[#03a9f4]">Radio</span> Favorita En Cualquier Momento
                            </h1>
                            <p className="text-lg text-gray-300 max-w-lg">
                                Música, entretenimiento y las mejores conversaciones. Sintoniza ahora y sé parte de
                                nuestra comunidad.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    variant="outline"
                                    className="border-[#03a9f4] text-[#03a9f4] hover:text-[#03a9f4]"
                                >
                                    <Link href="#schedule" className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Ver Programación
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-[#03a9f4] text-[#03a9f4] hover:text-[#03a9f4]"
                                >
                                    <Link
                                        href="https://mytunner.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                    >
                                        <Radio className="mr-2 h-4 w-4" />
                                        MyTunner
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="bg-[#333333] rounded-lg  p-1 md:p-6 shadow-lg">
                            <LiveChat />
                        </div>
                    </div>
                </div>
            </section>

            {/* Song Request Section - MOVIDA ANTES DE LA SECCIÓN DE CANCIONES */}
            <section id="request" className="py-20 bg-[#383838]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Solicita tu <span className="text-[#03a9f4]">Canción</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            ¿Quieres escuchar tu canción favorita? Solicítala y la pondremos al aire.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <SongRequest />
                    </div>
                </div>
            </section>

            {/* Song History & Upcoming Section */}
            <section id="songs" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Nuestras <span className="text-[#03a9f4]">Canciones</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Explora el historial de canciones reproducidas y descubre las próximas que sonarán en
                            nuestra radio.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <SongHistoryUpcoming />
                    </div>
                </div>
            </section>

            {/* Schedule Section */}
            <section id="schedule" className="py-20 bg-[#383838]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Nuestra <span className="text-[#03a9f4]">Programación</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Descubre todos nuestros programas y no te pierdas tus favoritos.
                        </p>
                    </div>

                    <ProgramSchedule />
                </div>
            </section>

            {/* Hosts Section */}
            <section id="hosts" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Nuestros <span className="text-[#03a9f4]">Locutores</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Conoce a las voces que te acompañan día a día con la mejor música, noticias y
                            entretenimiento.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 justify-center">
                        {hosts.map((host) => (
                            <HostCard key={host.id} host={host} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-[#383838]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Por Qué <span className="text-[#03a9f4]">Elegirnos</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Descubre lo que hace a Radio Cabral la mejor opción para mantenerte entretenido e informado.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-[#333333] p-6 rounded-lg">
                            <div className="bg-[#03a9f4]/10 p-3 rounded-full w-fit mb-4">
                                <Headphones className="h-6 w-6 text-[#03a9f4]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Calidad de Audio</h3>
                            <p className="text-gray-300">
                                Transmisión en alta definición para que disfrutes de la mejor calidad de sonido en
                                cualquier dispositivo.
                            </p>
                        </div>

                        <div className="bg-[#333333] p-6 rounded-lg">
                            <div className="bg-[#03a9f4]/10 p-3 rounded-full w-fit mb-4">
                                <Calendar className="h-6 w-6 text-[#03a9f4]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Programación Variada</h3>
                            <p className="text-gray-300">
                                Contenido diverso para todos los gustos, desde música hasta noticias, deportes y
                                entretenimiento.
                            </p>
                        </div>

                        <div className="bg-[#333333] p-6 rounded-lg">
                            <div className="bg-[#03a9f4]/10 p-3 rounded-full w-fit mb-4">
                                <Info className="h-6 w-6 text-[#03a9f4]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Siempre Actualizado</h3>
                            <p className="text-gray-300">
                                Las últimas noticias y tendencias musicales para mantenerte al día con lo que está
                                sucediendo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-[#03a9f4]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Desea escuchar la radio desde su carro?</h2>
                    <p className="text-white/90 max-w-2xl mx-auto mb-8">
                        Conecte su disitivo movil a su carro y escuche Radio Cabral en cualquier lugar con la app
                        MyTunner y reproduzca nuestra radio desde este link
                    </p>
                    <Button className="bg-white text-[#03a9f4] hover:bg-white/90">
                        <Link
                            href="https://mytunner.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <Radio className="mr-2 h-4 w-4" />
                            Ir a MyTunner
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#333333] py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Radio className="h-6 w-6 text-[#03a9f4]" />
                                <span className="text-lg font-bold">Radio Cabral</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Tu estación de radio favorita con la mejor música y contenido.
                            </p>
                            <div className="flex gap-4">
                                <Link href="#" className="text-[#03a9f4] hover:text-white transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-[#03a9f4] hover:text-white transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-[#03a9f4] hover:text-white transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-[#03a9f4] transition-colors">
                                        Inicio
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#hosts"
                                        className="text-gray-400 hover:text-[#03a9f4] transition-colors"
                                    >
                                        Locutores
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#schedule"
                                        className="text-gray-400 hover:text-[#03a9f4] transition-colors"
                                    >
                                        Programación
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#request"
                                        className="text-gray-400 hover:text-[#03a9f4] transition-colors"
                                    >
                                        Solicita tu Canción
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#songs"
                                        className="text-gray-400 hover:text-[#03a9f4] transition-colors"
                                    >
                                        Canciones
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://mytunner.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-[#03a9f4] transition-colors"
                                    >
                                        MyTunner
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Contacto</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>info@radiocabral.com</li>
                                <li>+123 456 7890</li>
                                <li>Calle Principal 123, Ciudad</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Horario</h3>
                            <p className="text-gray-400">Transmitiendo 24/7 para ti</p>
                            <p className="text-gray-400 mt-2">Atención al cliente: Lunes a Viernes, 9:00 - 18:00</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Radio Cabral. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
