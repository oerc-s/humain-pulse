import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Public Notices',
  description: 'Public enforcement notices feed. Non-conformance notices, debt accrual warnings, and status changes for entities in the Humain Pulse registry.',
  openGraph: {
    title: 'Public Notices | Humain Pulse',
    description: 'Public enforcement notices feed. Non-conformance notices and debt accrual warnings.'
  }
}

export default function EnforcementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
