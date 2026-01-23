import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Actors',
  description: 'All actors with clearing state. MEI (exposure pressure) and MLI (clearing capacity) across Capital, Compute, Intelligence, and Actuation sectors.',
  keywords: ['actors', 'clearing state', 'MEI', 'MLI', 'machine exposure', 'reinsurance', 'cloud', 'AI labs', 'robotics'],
  openGraph: {
    title: 'Actors | Humain Pulse',
    description: 'All actors with clearing state. Exposure accrues until clearing active.'
  }
}

export default function ActorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
