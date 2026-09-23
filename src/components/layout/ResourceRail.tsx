"use client";

import { RESOURCES } from "@/lib/caseload";
import { BookOpen, ExternalLink } from "lucide-react";

export function ResourceRail() {
  return (
    <aside className="resource-rail border-l h-screen overflow-y-auto px-4 py-5">
      <div className="kicker mb-3">Resource navigation</div>
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-4 h-4 text-[#c9a36a]" />
        <h2 className="text-sm font-semibold text-[#fff6e6]">Washington desk</h2>
      </div>
      <div className="space-y-6">
        {RESOURCES.map((group) => (
          <section key={group.group}>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[rgba(239,228,208,0.38)] mb-2">
              {group.group}
            </div>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noreferrer" className="flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 text-[12.5px] text-[rgba(239,228,208,0.7)] hover:bg-[rgba(239,228,208,0.04)] hover:text-[#fff6e6]">
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 mt-0.5 opacity-40 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-[rgba(201,163,106,0.18)] p-3 bg-[rgba(201,163,106,0.06)]">
        <div className="kicker">Hierarchy of work</div>
        <ol className="mt-2 space-y-1.5 text-[12px] text-[rgba(239,228,208,0.62)] list-decimal pl-4">
          <li>Keep the person housed today</li>
          <li>Hit the written deadline</li>
          <li>Seal a complete vault folio</li>
          <li>Hand the court a ready order</li>
        </ol>
      </div>
    </aside>
  );
}
