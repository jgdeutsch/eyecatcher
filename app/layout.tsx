import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Google Shopping Eye Catcher',
  description: 'Discover what product images get the highest clickthrough rate and conversion',
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

