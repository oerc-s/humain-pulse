import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import './globals.css'

const BASE_URL = 'https://pulse.humain.ai'

export const metadata: Metadata = {
  title: {
    default: 'Humain Pulse | Machine Liability & Exposure Registry',
    template: '%s | Humain Pulse'
  },
  description: 'Public machine-native risk clearing record. Tracking MLI (Liability) and MEI (Exposure) for autonomous agents and capital layers. HP-STD-001 Conformance.',
  keywords: ['machine liability', 'exposure index', 'HP-STD-001', 'conformance', 'reinsurance', 'AI risk', 'machine identity', 'settlement'],
  authors: [{ name: 'Humain Protocol' }],
  creator: 'Humain Protocol',
  publisher: 'Humain Protocol',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Humain Pulse',
    title: 'Humain Pulse | Machine Liability & Exposure Registry',
    description: 'Public machine-native risk clearing record. Tracking MLI (Liability) and MEI (Exposure) for autonomous agents and capital layers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Humain Pulse - Machine Liability Registry'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humain Pulse | Machine Liability & Exposure Registry',
    description: 'Public machine-native risk clearing record. HP-STD-001 Conformance.',
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
  '@type': 'WebApplication',
  name: 'Humain Pulse',
  description: 'Public machine-native liability and exposure registry. HP-STD-001 Conformance.',
  url: BASE_URL,
  applicationCategory: 'Risk Management',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  creator: {
    '@type': 'Organization',
    name: 'Humain Protocol'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
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
