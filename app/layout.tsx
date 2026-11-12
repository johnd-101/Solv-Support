import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: ' Solv-Support',
  description: 'Solv Medical Support App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}