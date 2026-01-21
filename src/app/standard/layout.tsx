import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HP-STD-001 Standard',
  description: 'HP-STD-001 machine-native primitives for liability clearing and exposure settlement. Deterministic scoring formulas for MLI and sector-specific MEI models.',
  openGraph: {
    title: 'HP-STD-001 Standard | Humain Pulse',
    description: 'Machine-native primitives for liability clearing and exposure settlement. Deterministic scoring formulas.'
  }
}

export default function StandardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
