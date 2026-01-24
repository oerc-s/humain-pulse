import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Certification',
  description: 'Machine-native clearing certification. Contact clearing@humain-pulse.com.',
}

export default function CertificationPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1000px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-8">
        Certification
      </h1>

      <div className="space-y-6">
        <div className="border border-white/10 bg-zinc-900/20 p-6">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            Contact
          </div>
          <a
            href="mailto:clearing@humain-pulse.com"
            className="font-mono text-xl text-white hover:text-emerald-400 transition-colors"
          >
            clearing@humain-pulse.com
          </a>
        </div>

        <div className="border border-white/10 bg-zinc-900/20 p-6">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            Requirements
          </div>
          <div className="space-y-2 font-mono text-sm text-zinc-300">
            <p>MID — Machine Identity</p>
            <p>M2M-SE — Settlement Endpoint</p>
          </div>
        </div>

        <div className="border border-red-900/50 bg-red-950/20 p-6">
          <p className="text-red-400 font-mono text-sm">
            No MID + no M2M-SE = Non-Clearable
          </p>
        </div>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        HP-STD-001 v1.10
      </div>
    </div>
  )
}
