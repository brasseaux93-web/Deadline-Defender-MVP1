import Link from "next/link";
import { LiquidGlassSurface } from "@/components/ui/LiquidGlassSurface";
import { ArrowLeft, Check } from "lucide-react";

export default function NewCase() {
  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in duration-500">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/cases" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Cases
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-white border-l border-white/10 pl-4">New Case</h1>
      </header>

      <div className="space-y-6">
        <section>
          <LiquidGlassSurface className="p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Filing & Hearing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Filing Date <span className="text-red-500">*</span></label>
                <input type="date" className="premium-input w-full" defaultValue="2026-09-15" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Hearing Date <span className="text-red-500">*</span></label>
                <input type="date" className="premium-input w-full" defaultValue="2026-09-25" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Court</label>
              <input type="text" className="premium-input w-full" defaultValue="King County District Court" />
            </div>
          </LiquidGlassSurface>
        </section>

        <section>
          <LiquidGlassSurface className="p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Status & Urgency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Status</label>
                <select className="premium-input w-full bg-black/50">
                  <option>Intake</option>
                  <option>Active</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Urgency</label>
                <select className="premium-input w-full bg-black/50">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
          </LiquidGlassSurface>
        </section>

        <section>
          <LiquidGlassSurface className="p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Tenant & Property</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Tenant Name <span className="text-red-500">*</span></label>
                <input type="text" className="premium-input w-full" defaultValue="Maria Gonzalez" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Case Number <span className="text-red-500">*</span></label>
                <input type="text" className="premium-input w-full" defaultValue="KC-2026-00482" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Property Address <span className="text-red-500">*</span></label>
                <input type="text" className="premium-input w-full" defaultValue="2847 Rainier Ave S, Seattle, WA 98144" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Landlord Name</label>
                  <input type="text" className="premium-input w-full" placeholder="e.g., Rainier Properties LLC" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Monthly Rent</label>
                  <input type="text" className="premium-input w-full" placeholder="e.g., $1,850" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Amount Owed</label>
                  <input type="text" className="premium-input w-full" placeholder="e.g., $3,700" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Assigned Advocate <span className="text-red-500">*</span></label>
                  <input type="text" className="premium-input w-full" defaultValue="Sarah Chen" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Tenant Phone</label>
                  <input type="text" className="premium-input w-full" placeholder="e.g., (206) 555-0142" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Tenant Email</label>
                  <input type="text" className="premium-input w-full" placeholder="e.g., tenant@email.com" />
                </div>
              </div>
            </div>
          </LiquidGlassSurface>
        </section>
      </div>

      <div className="fixed bottom-0 left-64 right-0 p-4 border-t border-white/10 bg-black/80 backdrop-blur-xl flex justify-end gap-3 z-10">
        <button className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-md transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2 text-sm font-medium text-black bg-white hover:bg-zinc-200 rounded-md transition-colors flex items-center gap-2">
          <Check className="w-4 h-4" />
          Create Case
        </button>
      </div>
    </div>
  );
}
