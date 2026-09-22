import { FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold tracking-[-0.03em] text-zinc-100">Documents & Templates</h1>
        <p className="text-xs text-zinc-400 font-normal mt-0.5">RCW 59.18 templates, generated drafts, and filing history</p>
      </header>
      <div className="panel p-12 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#27272a] flex items-center justify-center">
          <FileText className="w-4 h-4 text-zinc-600" />
        </div>
        <p className="text-xs text-zinc-600 max-w-48">
          Template library and document history coming soon. Use the Generator from any case row on the Dashboard.
        </p>
      </div>
    </div>
  );
}
