import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conformance Engine',
  description: 'HP-STD-001 Compliance Checker. Real-time primitive validation for machine identity, exposure index, settlement endpoints, liability chain, and control surface declaration.',
  openGraph: {
    title: 'Conformance Engine | Humain Pulse',
    description: 'HP-STD-001 Compliance Checker. Real-time primitive validation.'
  }
}

export default function ConformanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
