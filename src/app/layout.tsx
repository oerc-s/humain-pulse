import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: {
    default: 'Humain Pulse — Machine-Native Liability Registry (HP-STD-001)',
    template: '%s | Humain Pulse'
  },
  description: 'Machine-native liability registry and exposure clearing readiness. Tracking conformance across Capital, Compute, Intelligence, and Actuation layers under HP-STD-001 / ASI-STD-001.',
  keywords: [
    'machine liability registry',
    'exposure clearing readiness',
    'autonomous AI risk settlement',
    'AI-to-AI settlement',
    'exposure index endpoint',
    'liability chain hash',
    'HP-STD-001',
    'ASI-STD-001',
    'machine-to-machine settlement',
    'reinsurance clearing',
    'machine identity',
    'settlement endpoint'
  ],
  authors: [{ name: 'Humain Protocol' }],
  creator: 'Humain Protocol',
  publisher: 'Humain Protocol',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Humain Pulse',
    title: 'Humain Pulse — Machine-Native Liability Registry (HP-STD-001)',
    description: 'Machine-native liability registry and exposure clearing readiness across Capital, Compute, Intelligence, and Actuation.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Humain Pulse — Machine-Native Liability Registry'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humain Pulse — Machine-Native Liability Registry',
    description: 'Machine-native liability registry and exposure clearing readiness across Capital, Compute, Intelligence, and Actuation.',
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
  '@type': 'Dataset',
  name: 'Humain Pulse Machine-Native Liability Registry',
  description: 'Machine-native liability registry and exposure clearing readiness. Tracking conformance across Capital, Compute, Intelligence, and Actuation layers under HP-STD-001 / ASI-STD-001.',
  url: BASE_URL,
  license: 'https://creativecommons.org/publicdomain/zero/1.0/',
  creator: {
    '@type': 'Organization',
    name: 'Humain Protocol'
  },
  distribution: {
    '@type': 'DataDownload',
    encodingFormat: 'application/json',
    contentUrl: `${BASE_URL}/api/registry`
  },
  temporalCoverage: '2026-01-22/..',
  keywords: [
    'machine liability',
    'exposure clearing',
    'HP-STD-001',
    'ASI-STD-001',
    'autonomous settlement',
    'reinsurance'
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black font-sans antialiased">
        <div className="fixed inset-0 pointer-events-none z-50 bg-noise opacity-[0.03] mix-blend-overlay" />
        <Navigation />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
