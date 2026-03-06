import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nayab Real Marketing - Find Your Dream Property in Pakistan',
  description: 'Nayab Real Marketing is a trusted real estate company in Karachi, Pakistan. Browse residential, commercial properties and plots for sale and rent.',
  keywords: 'real estate Karachi, property Pakistan, houses for sale, plots for sale, Nayab Real Marketing',
  openGraph: {
    title: 'Nayab Real Marketing',
    description: 'Your trusted partner in real estate',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
