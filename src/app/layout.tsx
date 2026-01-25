import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const BASE_URL = 'https://humain-pulse.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Humain Pulse | Machine-Native Risk Clearing Operator',
    template: '%s | Humain Pulse'
  },
  description: 'Market infrastructure for machine-native risk clearing. Real-time classification: Non-Clearable / Clearable / Settled. Exposure accrues automatically (MEI / MLI / Δ24h). Primitives + APIs.',
  keywords: [
    'machine-native risk',
    'AGI risk',
    'AI risk clearing',
    'AI-to-AI settlement',
    'MID',
    'MEI',
    'MLI',
    'clearing operator',
    'settlement primitives',
    'HP-STD-001'
  ],
  authors: [{ name: 'Humain Pulse' }],
  creator: 'Humain Pulse',
  publisher: 'Humain Pulse',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Humain Pulse',
    title: 'Humain Pulse | Machine-Native Risk Clearing Operator',
    description: 'Market infrastructure for machine-native risk clearing. Real-time classification: Non-Clearable / Clearable / Settled. Exposure accrues automatically (MEI / MLI / Δ24h).',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Humain Pulse | Machine-Native Risk Clearing Operator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humain Pulse | Machine-Native Risk Clearing Operator',
    description: 'Market infrastructure for machine-native risk clearing. Real-time classification: Non-Clearable / Clearable / Settled.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  alternates: {
    canonical: BASE_URL
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Humain Pulse',
  description: 'Market infrastructure for machine-native risk clearing. Real-time classification and settlement.',
  url: BASE_URL,
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} style={{ backgroundColor: '#000' }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black font-sans antialiased" style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        <div className="fixed inset-0 pointer-events-none z-0 bg-noise opacity-[0.03] mix-blend-overlay" />
        <Navigation />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
