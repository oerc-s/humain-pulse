import type { Metadata } from 'next'
import { getInvoices } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Invoices',
  description: 'HP-STD-001 settlement invoices. AP-ready reconciliation documents.',
  keywords: ['invoices', 'HP-STD-001', 'settlement', 'reconciliation', 'AP-payable'],
}

export default function InvoicesPage() {
  const invoices = getInvoices()

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-4xl text-white font-medium uppercase mb-4">
        Invoices
      </h1>
      <p className="text-zinc-500 font-mono text-sm mb-12">
        AP-ready settlement documents. Status Reconciliation payables.
      </p>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b border-white/10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
        <div className="col-span-3">Invoice Ref</div>
        <div className="col-span-2">Actor</div>
        <div className="col-span-2">Line Item</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-1">Cycle_ID</div>
        <div className="col-span-1">Due_Date</div>
        <div className="col-span-1 text-center">Status</div>
      </div>

      <div className="space-y-1">
        {invoices.map((invoice) => (
          <div
            key={invoice.ref}
            className="border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900/20 transition-colors"
          >
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 items-center font-mono text-sm">
              <div className="col-span-3 text-zinc-300 text-xs">{invoice.ref}</div>
              <div className="col-span-2">
                <div className="text-white">{invoice.actor_name}</div>
                <div className="text-zinc-600 text-[10px]">{invoice.actor_id}</div>
              </div>
              <div className="col-span-2 text-zinc-400">{invoice.line_item}</div>
              <div className="col-span-2 text-right text-white font-bold">
                ${invoice.amount.toLocaleString()}
              </div>
              <div className="col-span-1 text-zinc-500 text-[10px]">v1.10</div>
              <div className="col-span-1 text-zinc-400 text-xs">{invoice.due_date}</div>
              <div className="col-span-1 text-center">
                <span className={`text-[10px] uppercase px-2 py-1 ${
                  invoice.status === 'paid' ? 'bg-emerald-900/30 text-emerald-400' :
                  invoice.status === 'issued' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold">{invoice.actor_name}</span>
                <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                  invoice.status === 'paid' ? 'bg-emerald-900/30 text-emerald-400' :
                  invoice.status === 'issued' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {invoice.status}
                </span>
              </div>

              <div className="text-zinc-400 text-sm font-mono mb-3">{invoice.line_item}</div>

              <div className="flex justify-between items-end font-mono">
                <div>
                  <div className="text-zinc-600 text-[10px]">Due</div>
                  <div className="text-zinc-400 text-xs">{invoice.due_date}</div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-600 text-[10px]">Amount</div>
                  <div className="text-white font-bold">${invoice.amount.toLocaleString()}</div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-600 mt-3 pt-3 border-t border-white/10">
                {invoice.ref}
              </div>
            </div>
          </div>
        ))}
      </div>

      {invoices.length === 0 && (
        <div className="border border-zinc-800 p-8 text-center">
          <div className="text-zinc-500 font-mono">No invoices.</div>
        </div>
      )}

      <div className="mt-6 text-[10px] font-mono text-zinc-600">
        {invoices.length} invoices · Cycle: HP-STD-001 v1.10
      </div>

      {/* Line Items Legend */}
      <div className="mt-12 border-t border-white/10 pt-8">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Line Items</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="border border-zinc-800 p-3">
            <div className="text-zinc-300">Status Reconciliation</div>
            <div className="text-zinc-600 text-[10px] mt-1">UNSETTLED → PARTIAL/SETTLED</div>
          </div>
          <div className="border border-zinc-800 p-3">
            <div className="text-zinc-300">Exposure Normalization</div>
            <div className="text-zinc-600 text-[10px] mt-1">MEI reduction service</div>
          </div>
          <div className="border border-zinc-800 p-3">
            <div className="text-zinc-300">Clearing Activation</div>
            <div className="text-zinc-600 text-[10px] mt-1">Initial settlement setup</div>
          </div>
          <div className="border border-zinc-800 p-3">
            <div className="text-zinc-300">Index Maintenance</div>
            <div className="text-zinc-600 text-[10px] mt-1">Ongoing state tracking</div>
          </div>
        </div>
      </div>
    </div>
  )
}
