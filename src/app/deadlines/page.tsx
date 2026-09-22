import { CalendarDays } from "lucide-react";

export default function DeadlinesPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold tracking-[-0.03em] text-zinc-100">Deadlines</h1>
        <p className="text-xs text-zinc-400 font-normal mt-0.5">All upcoming court and filing deadlines</p>
      </header>
      <div className="panel p-12 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#27272a] flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-zinc-600" />
        </div>
        <p className="text-xs text-zinc-600">Full deadline calendar coming soon.</p>
      </div>
    </div>
  );
}
