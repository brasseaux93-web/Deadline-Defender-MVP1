"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { InstrumentStudio } from "@/components/vault/InstrumentStudio";
import type { InstrumentKind } from "@/lib/types";
import { allFolios, CLIENTS } from "@/lib/caseload";
import Link from "next/link";

function VaultInner() {
  const params = useSearchParams();
  const client = params.get("client") ?? undefined;
  const kind = (params.get("kind") as InstrumentKind | null) ?? undefined;
  const folios = allFolios();
  return (
    <div className="px-7 py-6">
      <div className="kicker">Client document organization · generation · safety vault</div>
      <h1 className="text-[26px] font-semibold text-[#fff8ea] mt-1 mb-2">Instruments, sealed to a name.</h1>
      <p className="text-[13.5px] text-[rgba(239,228,208,0.5)] max-w-2xl mb-6">
        Washington captions, RCW 59.18 / 59.12 authority, copper-highlighted parties, and a handoff path to the clerk, the sheriff, and counsel. Drafts are not a substitute for a lawyer.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {folios.slice(0, 8).map((f) => {
          const person = CLIENTS.find((c) => c.id === f.clientId)!;
          return (
            <Link key={f.id} href={`/vault?client=${f.clientId}&kind=${f.kind}`} className="folio">
              <div className="wax">{f.status.slice(0, 3).toUpperCase()}</div>
              <div className="min-w-0">
                <div className="text-[12.5px] text-[#fff6e6] truncate">{f.title}</div>
                <div className="text-[10px] text-[rgba(239,228,208,0.4)] truncate">{person.preferredName}</div>
              </div>
            </Link>
          );
        })}
      </div>
      <InstrumentStudio initialClientId={client} initialKind={kind} />
    </div>
  );
}

export default function VaultPage() {
  return (
    <Suspense fallback={<div className="px-7 py-10 text-[rgba(239,228,208,0.4)]">Opening vault…</div>}>
      <VaultInner />
    </Suspense>
  );
}
