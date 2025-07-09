import type { Metadata } from "next";
import "../styles/globals.css";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Refugio Musical | Radio desde La Romana para el mundo",
    description:
        "Refugio Musical es tu emisora en línea transmitiendo desde La Romana, República Dominicana. Disfruta de música, entretenimiento, programación variada y las voces de nuestros locutores. Solicita canciones, revisa la programación y mantente actualizado.",

    keywords: [
        "Refugio Musical",
        "radio online",
        "emisora en vivo",
        "música en línea",
        "radio desde La Romana",
        "programación radial",
        "solicitar canciones",
        "locutores dominicanos",
    ],

    authors: [{ name: "Gregory Cabral", url: "https://gregoryc.dev" }],
    creator: "Jose Cabral",
    publisher: "Gregory Cabral",
    metadataBase: new URL("https://refugiomusical.com"),
    alternates: {
        canonical: "/",
    },

    openGraph: {
        title: "Refugio Musical | Tu Emisora desde La Romana",
        description:
            "Disfruta de buena música, programación variada y locutores carismáticos desde República Dominicana.",
        url: "https://refugiomusical.com",
        siteName: "Refugio Musical",
        images: [
            {
                url: "/banner.png",
                width: 1200,
                height: 630,
                alt: "Refugio Musical - Banner",
            },
        ],
        locale: "es_DO",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Refugio Musical | Radio en Vivo",
        description: "Radio dominicana en línea con programación 24/7, desde La Romana para el mundo.",
        images: ["/banner.png"],
    },

    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },

    themeColor: "#f44336",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="dark">
            <body>{children}</body>
        </html>
    );
}
