import type { Metadata } from 'next'
import "../styles/globals.css"

export const metadata: Metadata = {
  title: 'Radio Cabral',
  description: 'La mejor música y entretenimiento en vivo',
  generator: 'Next.js',
  icons:{
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  }
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
