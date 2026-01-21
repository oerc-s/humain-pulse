import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'Humain Pulse public API documentation. RESTful endpoints for accessing actor data, conformance checks, and enforcement notices.',
  openGraph: {
    title: 'API Reference | Humain Pulse',
    description: 'Public API documentation for actor data, conformance checks, and notices.'
  }
}

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
