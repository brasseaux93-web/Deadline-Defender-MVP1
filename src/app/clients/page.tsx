"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CLIENTS } from "@/lib/caseload";
import { LANE_LABEL } from "@/lib/format";
import type { PracticeLane } from "@/lib/types";

const LANES: Array<PracticeLane | "all"> = ["all", "eviction", "housing", "medical", "benefits"];

export default function ClientsPage() {
  const [lane, setLane] = useState<PracticeLane | "all">("all");
  const [q, setQ] = useState("");
  const rows = useMemo(() => CLIENTS.filter((c) => {
    if (lane !== "all" && c.practice !== lane) return false;
    return `${c.legalName} ${c.docket ?? ""} ${c.city} ${c.advocate}`.toLowerCase().includes(q.toLowerCase());
  }), [lane, q]);
  return (
    <div className="px-7 py-6">
      <div className="kicker">Caseload</div>
      <h1 className="text-[26px] font-semibold text-[#fff8ea] mt-1 mb-4">People, not tickets.</h1>
      <div className="flex flex-wrap gap-2 mb-5">
        {LANES.map((l) => (
          <button key={l} onClick={() => setLane(l)} className={`pill ${lane === l ? "pill-soon" : ""}`}>{l === "all" ? "All lanes" : LANE_LABEL[l]}</button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, docket, city…" className="field max-w-xs ml-auto" />
      </div>
      <div className="grid gap-3">
        {rows.map((c) => (
          <Link key={c.id} href={`/clients/${c.id}`} className="panel p-4 hover:border-[rgba(201,163,106,0.28)]">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl grid place-items-center bg-[rgba(201,163,106,0.12)] text-[#e8c48a] font-semibold">{c.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[16px] text-[#fff6e6] font-semibold">{c.preferredName}</h2>
                  <span className={`pill pill-${c.urgency}`}>{c.urgency}</span>
                  <span className="pill">{LANE_LABEL[c.practice]}</span>
                </div>
                <p className="mt-1 text-[13px] text-[rgba(239,228,208,0.55)] line-clamp-2">{c.story}</p>
                <div className="mt-2 text-[11px] text-[rgba(239,228,208,0.38)]">{c.docket ?? "No docket yet"} · {c.city} · {c.advocate}</div>
              </div>
              <div className="text-right text-[12px] text-[rgba(239,228,208,0.45)]">{c.folios.length} folios<div>{c.dates.length} dates</div></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
