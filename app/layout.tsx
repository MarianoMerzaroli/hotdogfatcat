import type { Metadata } from 'next'
import Script from 'next/script'
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
      <body>
        {children}
        <Script
          src="https://www.gofundme.com/static/js/embed.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}

