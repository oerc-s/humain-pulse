import Link from 'next/link'

export default function HPStdPage() {
  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[700px] mx-auto">

        <h1 className="text-xl font-medium text-white uppercase tracking-tight mb-8">
          Settlement Primitives
        </h1>

        <div className="font-mono text-sm space-y-4">
          <div className="flex gap-4"><span className="text-emerald-400 w-20 shrink-0">MID</span><span className="text-zinc-400">Machine Identity Declaration</span></div>
          <div className="flex gap-4"><span className="text-emerald-400 w-20 shrink-0">EI</span><span className="text-zinc-400">Exposure Identifier</span></div>
          <div className="flex gap-4"><span className="text-emerald-400 w-20 shrink-0">M2M-SE</span><span className="text-zinc-400">Machine-to-Machine Settlement Endpoint</span></div>
          <div className="flex gap-4"><span className="text-emerald-400 w-20 shrink-0">LCH</span><span className="text-zinc-400">Lifecycle Hash</span></div>
          <div className="flex gap-4"><span className="text-emerald-400 w-20 shrink-0">CSD</span><span className="text-zinc-400">Conformance State Declaration</span></div>
        </div>

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors">← Back</Link>
        </div>
      </div>
    </div>
  )
}
