import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Actor Registry',
  description: 'Browse all registered entities in the Humain Pulse registry. View MLI (Machine Liability Index) and MEI (Machine Exposure Index) scores for autonomous agents across Capital, Compute, Intelligence, and Actuation layers.',
  openGraph: {
    title: 'Actor Registry | Humain Pulse',
    description: 'Browse all registered entities with MLI and MEI scores across Capital, Compute, Intelligence, and Actuation layers.'
  }
}

export default function EntitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
