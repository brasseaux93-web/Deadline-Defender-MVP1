import { Zap } from "lucide-react";

export default function IntakePage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold tracking-[-0.03em] text-zinc-100">Emergency Intake</h1>
        <p className="text-xs text-zinc-400 font-normal mt-0.5">Rapid triage for new eviction notices and same-day hearings</p>
      </header>
      <div className="panel p-12 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#27272a] flex items-center justify-center">
          <Zap className="w-4 h-4 text-zinc-600" />
        </div>
        <p className="text-xs text-zinc-600 max-w-48">
          Emergency intake form and same-day triage workflow coming soon.
        </p>
      </div>
    </div>
  );
}
