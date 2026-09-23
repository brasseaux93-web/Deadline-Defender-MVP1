"use client";

import { useMemo, useState } from "react";
import { CLIENTS } from "@/lib/caseload";
import { fillInstrument, INSTRUMENT_CATALOG } from "@/lib/wa-instruments";
import type { InstrumentKind } from "@/lib/types";
import { PleadingView } from "./PleadingView";
import { Check, Copy, Download, Printer, Send } from "lucide-react";

export function InstrumentStudio({ initialClientId, initialKind }: { initialClientId?: string; initialKind?: InstrumentKind }) {
  const [clientId, setClientId] = useState(initialClientId ?? CLIENTS[0].id);
  const [kind, setKind] = useState<InstrumentKind>(initialKind ?? "answer-affirmative-defenses");
  const [copied, setCopied] = useState(false);
  const client = CLIENTS.find((c) => c.id === clientId) ?? CLIENTS[0];
  const filled = useMemo(() => fillInstrument(kind, client), [kind, client]);
  const meta = INSTRUMENT_CATALOG.find((m) => m.kind === kind)!;

  const copyPlain = async () => {
    await navigator.clipboard.writeText(filled.markdown.replace(/⟦|⟧/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([filled.markdown.replace(/⟦|⟧/g, "")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kind}-${client.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-5">
      <div className="space-y-4">
        <div className="panel p-4 space-y-3">
          <div className="kicker">Household file</div>
          <select className="field" value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {CLIENTS.map((c) => (
              <option key={c.id} value={c.id}>{c.preferredName} · {c.practice}</option>
            ))}
          </select>
          <div className="text-[12px] text-[rgba(239,228,208,0.55)] leading-relaxed">
            {client.address}, {client.city} {client.zip}{client.docket ? ` · ${client.docket}` : ""}
          </div>
        </div>
        <div className="panel p-4">
          <div className="kicker mb-3">Instrument</div>
          <div className="space-y-1.5">
            {INSTRUMENT_CATALOG.map((item) => (
              <button key={item.kind} onClick={() => setKind(item.kind)} className={`w-full text-left rounded-xl px-3 py-2 border ${kind === item.kind ? "border-[rgba(201,163,106,0.35)] bg-[rgba(201,163,106,0.08)]" : "border-transparent hover:bg-[rgba(239,228,208,0.04)]"}`}>
                <div className="text-[13px] text-[#fff6e6]">{item.title}</div>
                <div className="text-[10px] text-[rgba(239,228,208,0.4)]">{item.authority}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="panel p-4 space-y-2">
          <div className="kicker">Submit to the right people</div>
          <p className="text-[12.5px] leading-relaxed text-[rgba(239,228,208,0.62)]">{meta.submitTo}</p>
          <p className="text-[12px] text-[rgba(239,228,208,0.42)]">{meta.purpose}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div>
            <div className="kicker">Copper-marked pleading</div>
            <h2 className="text-lg font-semibold text-[#fff6e6]">{filled.title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-ghost" onClick={copyPlain}>{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied" : "Copy"}</button>
            <button className="btn btn-ghost" onClick={download}><Download className="w-3.5 h-3.5" />Export</button>
            <button className="btn btn-ghost" onClick={() => window.print()}><Printer className="w-3.5 h-3.5" />Print</button>
            <a className="btn btn-copper" href="https://kingcounty.gov/en/dept/dja" target="_blank" rel="noreferrer"><Send className="w-3.5 h-3.5" />King County eFile</a>
          </div>
        </div>
        <PleadingView markdown={filled.markdown} names={filled.names} />
      </div>
    </div>
  );
}
