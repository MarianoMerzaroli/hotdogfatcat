import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hot Dog Fat Cat',
  description: 'Welcome to our website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

