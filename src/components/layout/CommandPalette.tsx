"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CLIENTS } from "@/lib/caseload";
import { INSTRUMENT_CATALOG } from "@/lib/wa-instruments";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const people = CLIENTS.filter((c) =>
      `${c.legalName} ${c.docket ?? ""} ${c.practice}`.toLowerCase().includes(query),
    ).map((c) => ({
      id: c.id,
      label: c.preferredName,
      sub: `${c.docket ?? c.practice} · ${c.city}`,
      href: `/clients/${c.id}`,
    }));
    const docs = INSTRUMENT_CATALOG.filter((d) =>
      `${d.title} ${d.authority}`.toLowerCase().includes(query),
    ).map((d) => ({
      id: d.kind,
      label: d.title,
      sub: d.authority,
      href: `/vault?kind=${d.kind}`,
    }));
    const pages = [
      { id: "cmd", label: "Command deck", sub: "Today's work", href: "/" },
      { id: "cal", label: "Date constellation", sub: "Hearings and notices", href: "/calendar" },
      { id: "int", label: "Emergency intake", sub: "New household", href: "/intake" },
    ].filter((p) => p.label.toLowerCase().includes(query) || !query);
    return [...pages, ...people, ...docs].slice(0, 10);
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="mx-auto mt-[18vh] w-full max-w-xl panel overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a person, date, or instrument…" className="field border-0 rounded-none px-4 py-3 text-[15px]" />
        <ul className="border-t border-[rgba(232,220,196,0.08)] max-h-80 overflow-y-auto">
          {results.map((r) => (
            <li key={r.id}>
              <button className="w-full text-left px-4 py-2.5 hover:bg-[rgba(239,228,208,0.05)]" onClick={() => { router.push(r.href); setOpen(false); }}>
                <div className="text-sm text-[#fff6e6]">{r.label}</div>
                <div className="text-[11px] text-[rgba(239,228,208,0.45)]">{r.sub}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
